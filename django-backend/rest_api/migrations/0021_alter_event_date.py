# Generated by Django 4.1.7 on 2023-03-13 17:56

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rest_api', '0020_alter_event_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='date',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2023, 3, 13, 19, 56, 14, 80178)),
        ),
    ]
