import React from 'react'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Users from './Users';
import Teams from './Teams';
import Games from './Games';

const AdminTabs = () => {
    return (
        <Tabs
          defaultActiveKey="users"
          id="fill-tab-example"
          className="mb-3"
          fill
        > 
            <Tab eventKey="users" title="Users">
                <Users />
            </Tab>
            <Tab eventKey="teams" title="Teams">
                <Teams />
            </Tab>
            <Tab eventKey="games" title="Games">
                <Games />
            </Tab>
            {/* <Tab eventKey="longer-tab" title="Loooonger Tab">
                Tab content for Loooonger Tab
            </Tab>
            <Tab eventKey="contact" title="Contact">
                Tab content for Contact
            </Tab> */}
        </Tabs>
    );
}

export default AdminTabs