# Generated by Django 4.1.7 on 2023-03-20 16:15

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rest_api', '0024_employeeprivateinfo_alter_event_date_employeeevent_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='date',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2023, 3, 20, 18, 15, 19, 548623)),
        ),
    ]
