# Generated by Django 4.1.7 on 2023-03-12 17:29

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rest_api', '0010_alter_event_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='date',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2023, 3, 12, 19, 29, 12, 431983)),
        ),
    ]
