import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {AppHome} from "./components/AppHome";
import {AppMenu} from "./components/AppMenu";
import {AllLocations} from "./components/locations/AllLocations";
import {LocationAdd} from "./components/locations/LocationAdd";
import {LocationDetails} from "./components/locations/LocationDetails";
import {LocationUpdate} from "./components/locations/LocationUpdate";
import {LocationDelete} from "./components/locations/LocationDelete";
import {LocationFilter} from "./components/locations/LocationFilter";


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
                    <Route path="/locations/in-city/:city" element={<LocationFilter/>}/>
                </Routes>
            </Router>
        </React.Fragment>
    );
}

export default App;