import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {AppHome} from "./components/AppHome";
import {AppMenu} from "./components/AppMenu";
import {AllLocations} from "./components/locations/AllLocations";
import {LocationAdd} from "./components/locations/LocationAdd";
import {LocationDetails} from "./components/locations/LocationDetails";
import {LocationUpdate} from "./components/locations/LocationUpdate";
import {LocationDelete} from "./components/locations/LocationDelete";
import {LocationFilterByCity} from "./components/locations/LocationFilterByCity";
import {AllEmployees} from "./components/employees/AllEmployees";
import {EmployeeDetails} from "./components/employees/EmployeeDetails";
import {EmployeeUpdate} from "./components/employees/EmployeeUpdate";
import {EmployeeDelete} from "./components/employees/EmployeeDelete";
import {EmployeeAdd} from "./components/employees/EmployeeAdd";
import {AllEvents} from "./components/events/AllEvents";
import {EventDetails} from "./components/events/EventDetails";
import {EventUpdate} from "./components/events/EventUpdate";
import {EventDelete} from "./components/events/EventDelete";
import {EventAdd} from "./components/events/EventAdd";
import {AllEmployeesAssigned} from "./components/assignments/employees_to_event/AllEmployeesAssigned";
import {EmployeesAssignedDetails} from "./components/assignments/employees_to_event/EmployeesAssignedDetails";
import {EmployeesAssignedUpdate} from "./components/assignments/employees_to_event/EmployeesAssignedUpdate";
import {EmployeesAssignedDelete} from "./components/assignments/employees_to_event/EmployeesAssignedDelete";
import {EmployeesAssignedAdd} from "./components/assignments/employees_to_event/EmployeesAssignedAdd";
import {AllEventsAssigned} from "./components/assignments/events_to_employee/AllEventsAssigned";
import {EventsAssignedDetails} from "./components/assignments/events_to_employee/EventsAssignedDetails";
import {EventsAssignedUpdate} from "./components/assignments/events_to_employee/EventsAssignedUpdate";
import {EventsAssignedDelete} from "./components/assignments/events_to_employee/EventsAssignedDelete";
import {EventsAssignedAdd} from "./components/assignments/events_to_employee/EventsAssignedAdd";
import {EmployeeFilterBySalary} from "./components/employees/EmployeeFilterBySalary";
import {EmployeeStatAvgEventOutcome} from "./components/employees/EmployeeStatAvgEventOutcome";
import {EventStatAvgSalaryParticipants} from "./components/events/EventStatAvgSalaryParticipants";


function App() {
    return (
        <React.Fragment>
            <Router>
                <AppMenu/>

                <Routes>
                    <Route path="/" element={<AppHome/>}/>

                    <Route path="/locations" element={<AllLocations/>}/>
                    <Route path="/locations/:locationID/details" element={<LocationDetails/>}/>
                    <Route path="/locations/:locationID/edit" element={<LocationUpdate/>}/>
                    <Route path="/locations/:locationID/delete" element={<LocationDelete/>}/>
                    <Route path="/locations/add" element={<LocationAdd/>}/>
                    <Route path="/locations/in-city/:city" element={<LocationFilterByCity/>}/>

                    <Route path="/employees" element={<AllEmployees/>}/>
                    <Route path="/employees/:employeeID/details" element={<EmployeeDetails/>}/>
                    <Route path="/employees/:employeeID/edit" element={<EmployeeUpdate/>}/>
                    <Route path="/employees/:employeeID/delete" element={<EmployeeDelete/>}/>
                    <Route path="/employees/add" element={<EmployeeAdd/>}/>
                    <Route path="/employees/salary-bigger-than/:salary" element={<EmployeeFilterBySalary/>}/>
                    <Route path="/employees/by-avg-event-outcome" element={<EmployeeStatAvgEventOutcome/>}/>

                    <Route path="/events" element={<AllEvents/>}/>
                    <Route path="/events/:eventID/details" element={<EventDetails/>}/>
                    <Route path="/events/:eventID/edit" element={<EventUpdate/>}/>
                    <Route path="/events/:eventID/delete" element={<EventDelete/>}/>
                    <Route path="/events/add" element={<EventAdd/>}/>
                    <Route path="/events/by-avg-salary-of-participants" element={<EventStatAvgSalaryParticipants/>}/>

                    <Route path="/events/:eventID/employees-assigned" element={<AllEmployeesAssigned/>}/>
                    <Route path="/events/:eventID/employees-assigned/:assignmentID/details" element={<EmployeesAssignedDetails/>}/>
                    <Route path="/events/:eventID/employees-assigned/:assignmentID/edit" element={<EmployeesAssignedUpdate/>}/>
                    <Route path="/events/:eventID/employees-assigned/:assignmentID/delete" element={<EmployeesAssignedDelete/>}/>
                    <Route path="/events/:eventID/employees-assigned/add" element={<EmployeesAssignedAdd/>}/>

                    <Route path="/employees/:employeeID/events-assigned" element={<AllEventsAssigned/>}/>
                    <Route path="/employees/:employeeID/events-assigned/:assignmentID/details" element={<EventsAssignedDetails/>}/>
                    <Route path="/employees/:employeeID/events-assigned/:assignmentID/edit" element={<EventsAssignedUpdate/>}/>
                    <Route path="/employees/:employeeID/events-assigned/:assignmentID/delete" element={<EventsAssignedDelete/>}/>
                    <Route path="/employees/:employeeID/events-assigned/add" element={<EventsAssignedAdd/>}/>
                </Routes>
            </Router>
        </React.Fragment>
    );
}
export default App;