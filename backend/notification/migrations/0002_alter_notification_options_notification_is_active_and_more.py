# Generated by Django 5.1 on 2025-06-04 17:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notification', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='notification',
            options={'ordering': ['-timestamp']},
        ),
        migrations.AddField(
            model_name='notification',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='notification',
            name='link',
            field=models.URLField(blank=True, null=True),
        ),
    ]
