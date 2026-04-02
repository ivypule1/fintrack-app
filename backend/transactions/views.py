from rest_framework import serializers, viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Q
from .models import Transaction
import datetime


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'title', 'amount', 'transaction_type', 'category', 'date', 'note', 'created_at']
        read_only_fields = ['created_at']


class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Transaction.objects.filter(user=self.request.user)
        t_type = self.request.query_params.get('type')
        category = self.request.query_params.get('category')
        month = self.request.query_params.get('month')
        year = self.request.query_params.get('year')
        if t_type:
            qs = qs.filter(transaction_type=t_type)
        if category:
            qs = qs.filter(category=category)
        if month and year:
            qs = qs.filter(date__month=month, date__year=year)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def summary(self, request):
        user = request.user
        qs = Transaction.objects.filter(user=user)

        month = request.query_params.get('month', datetime.date.today().month)
        year = request.query_params.get('year', datetime.date.today().year)
        monthly_qs = qs.filter(date__month=month, date__year=year)

        total_income = monthly_qs.filter(transaction_type='income').aggregate(Sum('amount'))['amount__sum'] or 0
        total_expenses = monthly_qs.filter(transaction_type='expense').aggregate(Sum('amount'))['amount__sum'] or 0

        by_category = (
            monthly_qs.filter(transaction_type='expense')
            .values('category')
            .annotate(total=Sum('amount'))
            .order_by('-total')
        )

        monthly_trend = []
        for m in range(1, 13):
            income = qs.filter(date__year=year, date__month=m, transaction_type='income').aggregate(Sum('amount'))['amount__sum'] or 0
            expense = qs.filter(date__year=year, date__month=m, transaction_type='expense').aggregate(Sum('amount'))['amount__sum'] or 0
            monthly_trend.append({'month': m, 'income': float(income), 'expense': float(expense)})

        return Response({
            'total_income': float(total_income),
            'total_expenses': float(total_expenses),
            'balance': float(total_income) - float(total_expenses),
            'by_category': list(by_category),
            'monthly_trend': monthly_trend,
        })
