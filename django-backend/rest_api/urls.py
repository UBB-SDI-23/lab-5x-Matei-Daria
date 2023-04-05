from django.urls import path
from .views import EventList, EventDetail, LocationList, LocationDetail, EmployeeList, EmployeeDetail, \
    EmployeeWithSalaryBigger, EmployeePrivateInformationList, EmployeeWithTheirEventsList, \
    EmployeeWithTheirEventsDetail, \
    EventWithItsEmployeesList, EventWithItsEmployeesDetail, EmployeePrivateInformationDetail, \
    EmployeesByAvgEventOutcomeScore, EventByAvgSalaryOfParticipants, LocationsInCity

urlpatterns = [
    path('events', EventList.as_view()),
    path("events/<int:pk>", EventDetail.as_view()),
    path("locations", LocationList.as_view()),
    path("locations/<int:pk>", LocationDetail.as_view()),
    path("employees", EmployeeList.as_view()),
    path("employees/<int:pk>", EmployeeDetail.as_view()),
    path("employees/<int:pk>/events-assigned", EmployeeWithTheirEventsList.as_view()),
    path("employees/<int:employee_id>/events-assigned/<int:id>", EmployeeWithTheirEventsDetail.as_view()),
    path("events/<int:pk>/employees-assigned", EventWithItsEmployeesList.as_view()),
    path("events/<int:event_id>/employees-assigned/<int:id>", EventWithItsEmployeesDetail.as_view()),
    path("employees/private-info", EmployeePrivateInformationList.as_view()),
    path("employees/<int:pk>/private-info", EmployeePrivateInformationDetail.as_view()),
    path("employees/salary-bigger-than/<int:pk>", EmployeeWithSalaryBigger.as_view()),
    path("employees/by-avg-event-outcome", EmployeesByAvgEventOutcomeScore.as_view()),
    path("events/by-avg-salary-of-participants", EventByAvgSalaryOfParticipants.as_view()),
    path("locations/in-city/<slug:pk>", LocationsInCity.as_view())
]
