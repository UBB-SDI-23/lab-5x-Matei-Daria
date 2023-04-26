import datetime
import os
import uuid

import django
from faker.providers import DynamicProvider

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'djangoProject.settings')

django.setup()

from faker import Faker
import random

fake = Faker()

NO_RECORDS = 1000000
NO_RECORDS_INTERMEDIARY = 10000000

filename = {
    "location": "location_insert_data.sql",
    "employee": "employee_insert_data.sql",
    "event": "event_insert_data.sql",
    "event_assignment": "event_assignment_insert_data.sql",
    "employee_private_info": "employee_private_info_insert_data.sql",
    "drop_constraints_indexes": "drop_constraints_indexes.sql",
    "add_constraints_indexes": "add_constraints_indexes.sql"
}


def drop_constraints_indexes():
    file = open(filename["drop_constraints_indexes"], "w")

    file.write("ALTER TABLE rest_api_location DROP CONSTRAINT IF EXISTS PK_Location;\n")

    file.write("ALTER TABLE rest_api_employee DROP CONSTRAINT IF EXISTS PK_Employee;\n")

    file.write("ALTER TABLE rest_api_event DROP CONSTRAINT IF EXISTS PK_Event;\n")
    file.write("ALTER TABLE rest_api_event DROP CONSTRAINT IF EXISTS FK_Event_Location;\n")
    file.write("DROP INDEX IF EXISTS IDX_Event_LocationID;\n")

    file.write("ALTER TABLE rest_api_eventassignment DROP CONSTRAINT IF EXISTS PK_EventAssignment;\n")
    file.write("ALTER TABLE rest_api_eventassignment DROP CONSTRAINT IF EXISTS FK_EventAssignment_Event;\n")
    file.write("ALTER TABLE rest_api_eventassignment DROP CONSTRAINT IF EXISTS PK_EventAssignment_Employee;\n")
    file.write("DROP INDEX IF EXISTS IDX_EventAssignment_EventID;\n")
    file.write("DROP INDEX IF EXISTS IDX_EventAssignment_EmployeeID;\n")

    file.write("ALTER TABLE rest_api_employeeprivateinfo DROP CONSTRAINT IF EXISTS FK_EmployeePrivateInfo_Employee;\n")

    file.close()


def add_constraints_indexes():
    file = open(filename["add_constraints_indexes"], "w")

    file.write("ALTER TABLE rest_api_location ADD CONSTRAINT PK_Location PRIMARY KEY(id);\n")

    file.write("ALTER TABLE rest_api_employee ADD CONSTRAINT PK_Employee PRIMARY KEY(id);\n")

    file.write("ALTER TABLE rest_api_event ADD CONSTRAINT PK_Event PRIMARY KEY(id);\n")
    file.write(
        "ALTER TABLE rest_api_event ADD CONSTRAINT FK_Event_Location FOREIGN KEY(location_id) REFERENCES rest_api_location(id) ON DELETE CASCADE;\n")

    file.write("ALTER TABLE rest_api_eventassignment ADD CONSTRAINT PK_EventAssignment PRIMARY KEY(id);\n")
    file.write(
        "ALTER TABLE rest_api_eventassignment ADD CONSTRAINT FK_EventAssignment_Event FOREIGN KEY(event_id) REFERENCES rest_api_event(id) ON DELETE CASCADE;\n")
    file.write(
        "ALTER TABLE rest_api_eventassignment ADD CONSTRAINT FK_EventAssignment_Employee FOREIGN KEY(employee_id) REFERENCES rest_api_employee(id) ON DELETE CASCADE;\n")

    file.write(
        "ALTER TABLE rest_api_employeeprivateinfo ADD CONSTRAINT FK_EmployeePrivateInfo_Employee FOREIGN KEY(employee_id) REFERENCES rest_api_employee(id) ON DELETE CASCADE;\n")

    file.write("CREATE INDEX IDX_Event_LocationID ON rest_api_event(location_id);\n")
    file.write("CREATE INDEX IDX_EventAssignment_EventID ON rest_api_eventassignment(event_id);\n")
    file.write("CREATE INDEX IDX_EventAssignment_EmployeeID ON rest_api_eventassignment(employee_id);\n")

    file.close()


def location_insert_data():
    file = open(filename["location"], "w")
    file.write("TRUNCATE TABLE rest_api_location RESTART IDENTITY CASCADE;\n")

    batch_values = ""

    print("Generating SQL queries for inserting data in the Location table...")

    for i in range(NO_RECORDS):
        street = fake.street_name()[:50]
        number = fake.building_number()[:10]
        city = fake.city()[:20]
        building_name = fake.company()[:30]
        details = fake.text(max_nb_chars=30)
        batch_values += f"('{street}', '{number}', '{city}', '{building_name}', '{details}'),"
        if (i + 1) % 1000 == 0:
            file.write(
                f"INSERT INTO rest_api_location (street, number, city, building_name, details) VALUES {batch_values[:-1]};\n")
            batch_values = ""

    file.close()


def employee_insert_data():
    file = open(filename["employee"], "w")
    file.write("TRUNCATE TABLE rest_api_employee RESTART IDENTITY CASCADE;\n")

    batch_values = ""

    job_provider = DynamicProvider(
        provider_name="job_in_my_company",
        elements=["manager", "assistant manager", "salesperson", "accountant", "hr", "outside hire", "it", "cleaning",
                  "security"]
    )
    fake.add_provider(job_provider)

    print("Generating SQL queries for inserting data in the Employee table...")

    for i in range(NO_RECORDS):
        name = fake.name()[:50]
        job = fake.job_in_my_company()
        hire_date = fake.date_between(datetime.date(2010, 1, 1), datetime.date(2023, 1, 1))
        salary = random.randint(3000, 10000)
        on_leave = bool(random.getrandbits(1))

        batch_values += f"('{name}', '{job}', '{hire_date}', {salary}, {on_leave}),"
        if (i + 1) % 1000 == 0:
            file.write(
                f"INSERT INTO rest_api_employee (name, job, hire_date, salary, on_leave) VALUES {batch_values[:-1]};\n")
            batch_values = ""

    file.close()


def event_insert_data():
    file = open(filename["event"], "w")
    file.write("TRUNCATE TABLE rest_api_event RESTART IDENTITY CASCADE;\n")

    batch_values = ""

    print("Generating SQL queries for inserting data in the Event table...")

    for i in range(NO_RECORDS):
        name = fake.bs()[:50]
        details = fake.text(max_nb_chars=50)
        date = fake.date_between(datetime.date(2023, 1, 1), datetime.date(2024, 1, 1))
        importance = random.randint(1, 3)
        business_trip = bool(random.getrandbits(1))
        location_id = random.randint(0, NO_RECORDS)

        batch_values += f"('{name}', '{details}', '{date}', {importance}, {business_trip}, {location_id}),"
        if (i + 1) % 1000 == 0:
            file.write(
                f"INSERT INTO rest_api_event(name, details, date, importance, business_trip, location_id) VALUES {batch_values[:-1]};\n")
            batch_values = ""

    file.close()


def event_assignment_insert_data():
    file = open(filename["event_assignment"], "w")
    file.write("TRUNCATE TABLE rest_api_eventassignment RESTART IDENTITY CASCADE;\n")

    batch_values = ""

    print("Generating SQL queries for inserting data in the EventAssignment table...")

    for i in range(NO_RECORDS_INTERMEDIARY):

        event_summary = fake.text(max_nb_chars=50)
        event_outcome = random.randint(1, 5)

        employee_id = random.randint(0, NO_RECORDS - 1)
        event_id = random.randint(0, NO_RECORDS - 1)

        batch_values += f"('{event_summary}', '{event_outcome}', {employee_id}, {event_id}),"

        if (i + 1) % 10000 == 0:
            print(i)
            file.write(
                f"INSERT INTO rest_api_eventassignment(event_summary, event_outcome, employee_id, event_id) VALUES {batch_values[:-1]};\n")
            batch_values = ""

    file.close()


def employee_private_info_insert_data():
    cnps = {}

    def generate_cnp():
        cnp = random.randint(10000000, 99999999)
        while cnp in cnps.keys():
            cnp = random.randint(10000000, 99999999)
        cnps[cnp] = 1
        return cnp

    file = open(filename["employee_private_info"], "w")
    file.write("TRUNCATE TABLE rest_api_employeeprivateinfo RESTART IDENTITY CASCADE;\n")

    batch_values = ""

    print("Generating SQL queries for inserting data in the EmployeePrivateInfo table...")

    for i in range(NO_RECORDS):
        cnp = str(generate_cnp())
        address = fake.address()[:50]
        birth_date = fake.date_between(datetime.date(1960, 1, 1), datetime.date(2000, 1, 1))

        batch_values += f"({i}, '{cnp}', '{address}', '{birth_date}'),"
        if (i + 1) % 1000 == 0:
            file.write(
                f"INSERT INTO rest_api_employeeprivateinfo(employee_id, cnp, address, birth_date) VALUES {batch_values[:-1]};\n")
            batch_values = ""

    file.close()


if __name__ == '__main__':
    # drop_constraints_indexes()
    # add_constraints_indexes()
    location_insert_data()
    employee_insert_data()
    event_insert_data()
    event_assignment_insert_data()
    employee_private_info_insert_data()
