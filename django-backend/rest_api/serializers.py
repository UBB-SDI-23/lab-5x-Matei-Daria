from datetime import datetime

from .models import Event, Location, Employee, EventAssignment, EmployeePrivateInfo
from rest_framework import serializers


class EventSerializer(serializers.ModelSerializer):
    avg_salary_participants = serializers.FloatField(read_only=True)

    class Meta:
        model = Event
        fields = ['id', 'name', 'details', 'date', 'importance', 'business_trip', 'location', 'avg_salary_participants']


class LocationDetailSerializer(serializers.ModelSerializer):
    events = EventSerializer(read_only=True, many=True)

    class Meta:
        model = Location
        fields = ['id', 'street', 'number', 'city', 'building_name', 'details', 'events']


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['id', 'street', 'number', 'city', 'building_name', 'details']


class EventDetailSerializer(serializers.ModelSerializer):
    location = LocationSerializer(read_only=True)

    def validate_location_id(self, value):
        filter = Location.objects.filter(id=value)
        if not filter.exists():
            raise serializers.ValidationError("Location does not exists")
        return value

    class Meta:
        model = Event
        fields = ['id', 'name', 'details', 'date', 'importance', 'business_trip', 'employees', 'location_id',
                  'location']


class EmployeeSerializer(serializers.ModelSerializer):
    avg_outcome = serializers.FloatField(read_only=True)

    class Meta:
        model = Employee
        fields = ['id', 'name', 'job', 'hire_date', 'salary', 'on_leave', 'avg_outcome']


class EmployeeDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'name', 'job', 'hire_date', 'salary', 'on_leave', 'events']


class EventAssignmentSerializer(serializers.ModelSerializer):
    employee_id = serializers.IntegerField()
    event_id = serializers.IntegerField()

    def validate_employee_id(self, value):
        filter_id = Employee.objects.filter(id=value)
        if not filter_id.exists():
            raise serializers.ValidationError("Employee does not exist")
        return value

    def validate_event_id(self, value):
        filter_id = Event.objects.filter(id=value)
        if not filter_id.exists():
            raise serializers.ValidationError("Event does not exist")
        return value

    class Meta:
        model = EventAssignment
        fields = ('id', 'employee_id', 'event_id', 'event_summary', 'event_outcome')


class EventAssignmentDetailSerializer(serializers.ModelSerializer):
    employee = EmployeeSerializer(read_only=True, many=False)
    event = EventSerializer(read_only=True, many=False)

    def validate_employee_id(self, value):
        filter_id = Employee.objects.filter(id=value)
        if not filter_id.exists():
            raise serializers.ValidationError("Employee does not exist")
        return value

    def validate_event_id(self, value):
        filter_id = Event.objects.filter(id=value)
        if not filter_id.exists():
            raise serializers.ValidationError("Event does not exist")
        return value

    class Meta:
        model = EventAssignment
        fields = ('id', 'employee_id', 'employee', 'event_id', 'event', 'event_summary', 'event_outcome')


class EmployeePrivateInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeePrivateInfo
        fields = ('employee', 'cnp', 'address', 'birth_date')


class EmployeePrivateInfoDetailSerializer(serializers.ModelSerializer):
    employee = EmployeeSerializer(read_only=True)

    def validate_employee_id(self, value):
        filter_id = Employee.objects.filter(id=value)
        if not filter_id.exists():
            raise serializers.ValidationError("Employee does not exist")
        return value

    class Meta:
        model = EmployeePrivateInfo
        fields = ('employee_id', 'employee', 'cnp', 'address', 'birth_date')


