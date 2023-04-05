from django.db.models import Avg
from requests import Response
from rest_framework import generics, status
from rest_framework.views import APIView

from rest_api.custom_mixins import MultipleFieldLookupMixin
from rest_api.models import Event, Location, Employee, EmployeePrivateInfo, EventAssignment
from rest_api.serializers import EventDetailSerializer, LocationDetailSerializer, EmployeeSerializer, \
    LocationSerializer, \
    EventAssignmentSerializer, EmployeePrivateInfoSerializer, EventSerializer, EventAssignmentDetailSerializer, \
    EmployeePrivateInfoDetailSerializer, EmployeeDetailSerializer


class EventList(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer


class EventDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventDetailSerializer


class LocationList(generics.ListCreateAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer


class LocationDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationDetailSerializer


class EmployeeList(generics.ListCreateAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer


class EmployeeDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeDetailSerializer


class EmployeeWithTheirEventsList(generics.ListCreateAPIView):
    serializer_class = EventAssignmentSerializer

    def get_queryset(self):
        pk = self.kwargs['pk']
        query = EventAssignment.objects.filter(employee_id=pk)
        return query


class EmployeeWithTheirEventsDetail(MultipleFieldLookupMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = EventAssignment.objects.all()
    serializer_class = EventAssignmentDetailSerializer
    lookup_fields = ['employee_id', 'id']


class EventWithItsEmployeesList(generics.ListCreateAPIView):
    serializer_class = EventAssignmentSerializer

    def get_queryset(self):
        pk = self.kwargs['pk']
        query = EventAssignment.objects.filter(event_id=pk)
        return query


class EventWithItsEmployeesDetail(MultipleFieldLookupMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = EventAssignment.objects.all()
    serializer_class = EventAssignmentDetailSerializer
    lookup_fields = ['event_id', 'id']


class EmployeePrivateInformationList(generics.ListCreateAPIView):
    queryset = EmployeePrivateInfo.objects.all()
    serializer_class = EmployeePrivateInfoSerializer


class EmployeePrivateInformationDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = EmployeePrivateInfo.objects.all()
    serializer_class = EmployeePrivateInfoDetailSerializer


class EmployeeWithSalaryBigger(generics.ListAPIView):
    serializer_class = EmployeeSerializer

    def get_queryset(self):
        pk = self.kwargs['pk']
        query = Employee.objects.filter(salary__gt=pk).order_by('salary')
        return query


class EmployeesByAvgEventOutcomeScore(generics.ListAPIView):
    serializer_class = EmployeeSerializer

    def get_queryset(self):
        query = Employee.objects.annotate(avg_outcome=Avg('eventassignment__event_outcome')).exclude(
            avg_outcome=None).order_by('avg_outcome')

        return query


class EventByAvgSalaryOfParticipants(generics.ListAPIView):
    serializer_class = EventSerializer

    def get_queryset(self):
        query = Event.objects.annotate(avg_salary_participants=Avg('eventassignment__employee__salary')) \
            .exclude(avg_salary_participants=None).order_by('avg_salary_participants')

        return query


class LocationsInCity(generics.ListAPIView):
    serializer_class = LocationSerializer

    def get_queryset(self):
        pk = self.kwargs['pk']
        query = Location.objects.filter(city=pk)
        return query
