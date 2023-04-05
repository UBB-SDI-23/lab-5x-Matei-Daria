from dataclasses import dataclass
from datetime import datetime

import django.utils.dateparse
from django.db import models
from django.utils import timezone


class Location(models.Model):
    street = models.CharField(max_length=50)
    number = models.CharField(max_length=10)  # could contain letters
    city = models.CharField(max_length=20)
    building_name = models.CharField(max_length=30, blank=True)
    details = models.TextField(blank=True)

    def __str__(self):
        return self.street + " street, no." + self.number + ", " + self.city


class Employee(models.Model):
    name = models.CharField(max_length=50)
    job = models.CharField(max_length=50)
    hire_date = models.DateField()
    salary = models.IntegerField()
    on_leave = models.BooleanField(default=False)
    events = models.ManyToManyField('Event', through='EventAssignment')

    def __str__(self):
        return self.name


class Event(models.Model):
    name = models.CharField(max_length=100)
    details = models.TextField(blank=True, default="")
    date = models.DateTimeField(blank=True, default=timezone.now)
    importance = models.CharField(choices=[(1, 'high'), (2, 'medium'), (3, 'low')], max_length=10)
    business_trip = models.BooleanField(default=False)
    location = models.ForeignKey(Location, related_name='events', on_delete=models.CASCADE, null=True)
    employees = models.ManyToManyField('Employee', through='EventAssignment')

    def __str__(self):
        return self.name


class EventAssignment(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    event_summary = models.TextField(blank=True, default="no summary given/ the event hasn't happened yet")
    event_outcome = models.CharField(
        choices=[(1, 'very positive'), (2, 'positive'), (3, 'neutral'), (4, 'negative'), (5, 'very negative')],
        blank=True, default='neutral', max_length=20)

    def __str__(self):
        return "Event " + str(self.event) + "; Employee " + str(self.employee)


class EmployeePrivateInfo(models.Model):
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE, primary_key=True)
    cnp = models.CharField(max_length=15)
    address = models.CharField(max_length=100, blank=True, default="")
    birth_date = models.DateField(blank=True)

    def __str__(self):
        return "Employee " + str(self.employee) + "; CNP " + self.cnp
