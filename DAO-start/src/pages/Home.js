import React, { useEffect, useState } from "react";
import "./pages.css";
import sampleProposals from '../sampleProposals';
import { Tab, TabList, Widget, Tag, Table, Form } from "web3uikit";

const Home = () => {
 
const [proposals, setProposals] = useState(sampleProposals);

  return (
    <>
      <div className="content">
        <TabList defaultActiveKey={1} tabStyle="bulbUnion">
          <Tab tabKey={1} tabName="Dao">
            <div className="tabContent">
              Governance Overview
              <div className="widgets">
                <Widget
                  info={52}
                  title="Proposals Created"
                  style={{width: "200%"}}
                >
                  <div className="extraWidgetInfo">
                    <div className="extraTitle">Pass Rate</div>
                    <div className="progress">
                      <div
                        className="progressPercentage"
                        style={{width: `${60}%`}}
                      ></div>
                    </div>
                  </div>
                </Widget>
                <Widget info={423} title="Eligible voters"/>
                <Widget info={5} title="Ongoing proposals"/>
              </div>
              Recent proposals
              <div style={{marginTop: "30px"}}>
              {console.log(proposals)}
                <Table
                  columnsConfig="10% 70% 20%"
                  data={proposals}
                  header={[
                    <span>ID</span>,
                    <span>Description</span>,
                    <span>Status</span>,
                  ]}
                  pageSize={3}
                />
              </div>
              <Form 
                buttonConfig={{
                  isLoading: false,
                  loadingText: "Submitting proposal",
                  text: "Submit",
                  theme: "secondary",
                }}
                data={[
                  {
                    inputWidth: "100%",
                    name: "New Proposal",
                    type: 'textarea',
                    validation: {
                      required: true,
                    },
                    value: "",
                  },
                ]}
                onSubmit={(e) => {
                  alert('Proposal Submitted')
                }}
                title="Create a New Proposal"
              />
            </div>
          </Tab>
          <Tab tabKey={2} tabName="Forum"></Tab>
          <Tab tabKey={3} tabName="Docs"></Tab>
        </TabList>
      </div>
      <div className="voting"></div>
    </>
  );
};

export default Home;
