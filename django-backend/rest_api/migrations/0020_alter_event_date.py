# Generated by Django 4.1.7 on 2023-03-13 17:55

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rest_api', '0019_alter_event_date_alter_event_location'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='date',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2023, 3, 13, 19, 55, 56, 90344)),
        ),
    ]
