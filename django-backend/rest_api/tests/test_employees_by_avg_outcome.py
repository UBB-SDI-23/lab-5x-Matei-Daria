import random

from rest_framework.test import APITestCase

from rest_api.models import Employee, Event, EventAssignment


class EmployeesByAvgEventOutcomeScoreViewTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        no_of_employees = 30
        for employee_id in range(no_of_employees):
            Employee.objects.create(name=f"employee_{employee_id}", job="job_name", hire_date="2009-09-23",
                                    salary=3000 + (100 * employee_id), on_leave=0)

        no_of_events = 30
        for event_id in range(no_of_events):
            Event.objects.create(name=f"event_{event_id}", details="detail", importance=1, business_trip=0,
                                 date="2020-09-23 12:00:00-05:00")

        no_of_asgmt = 50
        for asgmt_id in range(no_of_asgmt):
            EventAssignment.objects.create(event_id=asgmt_id % no_of_events + 1,
                                           employee_id=asgmt_id % 10 + 5,
                                           # only employees with 5<= id <= 14 have events assigned
                                           event_summary="summary",
                                           event_outcome=random.randint(1, 5))

    def test_url_exists(self):
        response = self.client.get('/employees/by-avg-event-outcome')

        self.assertEqual(response.status_code, 200)

    def test_count_correct(self):
        response = self.client.get("/employees/by-avg-event-outcome")

        self.assertEqual(response.data["count"], 10)

    def test_report_correct(self):
        response = self.client.get("/employees/by-avg-event-outcome")

        self.assertGreaterEqual(response.data["results"][2]["avg_outcome"], response.data["results"][1]["avg_outcome"])
        self.assertGreaterEqual(response.data["results"][9]["avg_outcome"], response.data["results"][2]["avg_outcome"])

    def test_not_null_values(self):
        response = self.client.get("/employees/by-avg-event-outcome")

        self.assertIsNotNone(response.data["results"][4]["avg_outcome"])
        self.assertIsNotNone(response.data["results"][7]["avg_outcome"])
