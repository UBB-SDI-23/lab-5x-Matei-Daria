from rest_framework.test import APITestCase

from rest_api.models import Employee


class EmployeeWithSalaryBiggerViewTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        no_of_employees = 30
        for employee_id in range(no_of_employees):
            Employee.objects.create(name=f"employee_{employee_id}", job="job_name", hire_date="2009-09-23",
                                    salary=3000 + (100 * employee_id), on_leave=0)

    def test_url_exists(self):
        response = self.client.get('/employees/salary-bigger-than/0')

        self.assertEqual(response.status_code, 200)

    def test_count_correct(self):
        response = self.client.get("/employees/salary-bigger-than/0")

        self.assertEqual(response.data["count"], 30)

    def test_filter_correct(self):
        response = self.client.get("/employees/salary-bigger-than/3001")
        self.assertEqual(response.data["count"], 29)
        self.assertEqual(response.data["results"][0]["salary"], 3100)
        response = self.client.get(response.data.get('next'))
        self.assertEqual(response.data["results"][2]["salary"], 4300)  # the employee with id=12
        response = self.client.get(response.data.get('next'))
        self.assertEqual(response.data["results"][8]["salary"], 5900)  # the employee with id=29 (last in response.data)

        response = self.client.get("/employees/salary-bigger-than/4301")
        self.assertEqual(response.data["count"], 16)

        response = self.client.get("/employees/salary-bigger-than/6001")
        self.assertEqual(response.data["count"], 0)
