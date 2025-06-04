# notification/admin.py
from django.contrib import admin
from .models import Notification

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_active', 'timestamp', 'link')
    list_filter = ('is_active', 'timestamp')
    search_fields = ('title', 'message')
    # To make boolean fields more user-friendly in the admin list
    def is_active_display(self, obj):
        return obj.is_active
    is_active_display.boolean = True
    is_active_display.short_description = 'Active'

    # If you want to customize the fields in the add/change form:
    # fields = ('title', 'message', 'link', 'is_active') # 'timestamp' is auto_now_add

    # If you used created_at and updated_at:
    # readonly_fields = ('created_at', 'updated_at')