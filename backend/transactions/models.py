from django.db import models
from django.contrib.auth.models import User


class Category(models.Model):
    CATEGORY_CHOICES = [
        ('food', 'Food & Groceries'),
        ('transport', 'Transport'),
        ('bills', 'Bills & Utilities'),
        ('entertainment', 'Entertainment'),
        ('health', 'Health & Medical'),
        ('education', 'Education'),
        ('shopping', 'Shopping'),
        ('salary', 'Salary'),
        ('freelance', 'Freelance'),
        ('other', 'Other'),
    ]
    name = models.CharField(max_length=50, choices=CATEGORY_CHOICES, unique=True)

    def __str__(self):
        return self.get_name_display()

    class Meta:
        verbose_name_plural = 'Categories'


class Transaction(models.Model):
    TYPE_CHOICES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    title = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    transaction_type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    category = models.CharField(max_length=50, default='other')
    date = models.DateField()
    note = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} — {self.title} (R{self.amount})'

    class Meta:
        ordering = ['-date', '-created_at']
