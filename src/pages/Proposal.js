import React, { useState, useEffect } from "react";
import "./pages.css";
import { Tag, Widget, Blockie, Tooltip, Icon, Form, Table } from "web3uikit";
import { Link } from 'react-router-dom';
import sampleVotes from '../sampleVotes';

const Proposal = () => {

  const [votes, setVotes] = useState(sampleVotes);

  return (
    <>
      <div className="contentProposal">
        <div className="proposal">
          <Link to="/">
            <div className="backHome">
              <Icon fill="#fff" size={20} svg="chevronLeft" />
              Overview
            </div>
          </Link>
          <div>Should we accept Elon Musk $44b offer for our DAO?</div>
          <div className="proposalOverview">
            <Tag color={"red"} text={"Rejected"} />
            <div className="proposer">
              <span>Proposed By</span>
              <Tooltip content={"0x6E6D6cff559DA117eA8e11bb1cCE027F3442AEeD"}>
                <Blockie seed={"0x6E6D6cff559DA117eA8e11bb1cCE027F3442AEeD"} />
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="widgets">
          <Widget info={10} title="Votes for">
            <div className="extraWidgetInfo">
              <div className="extraTitle">{25}%</div>
              <div className="progress">
                <div 
                  className="progressPercentage"
                  style={{width: `${25}%`}}>
                </div>
              </div>
            </div>
          </Widget>
          <Widget info={30} title="Votes against">
            <div className="extraWidgetInfo">
              <div className="extraTitle" style={{color: 'red'}}>{75}%</div>
              <div className="progress">
                <div 
                  className="progressPercentage"
                  style={{width: `${75}%`, backgroundColor: 'red'}}>
                </div>
              </div>
            </div>
          </Widget>
        </div>

        <div className="votesDiv">
          <Table
            style={{width: "60%"}}
            columnsConfig="90% 10%"
            data={votes}
            header={[
              <span>Address</span>,
              <span>Vote</span>,
            ]}
            pageSize={5}
          ></Table>

          <Form
            style={{
              width: "35%",
              height: "250px",
              border: "1px solid rgba(6, 158, 252, 0.2)",
            }}
            buttonConfig={{
              isLoading: false,
              loadingText: "Casting vote",
              text: "Vote",
              theme: "secondary",
            }}
            data={[
              {
                inputWidth: "100%",
                name: "Cast vote",
                options: ["For", "Against"],
                type: "radios",
                validation: {
                  required: true,
                },
              },
            ]}
            onSubmit={(e) => {
              alert("Vote cast");
            }}
            title="Cast vote"
          />
        </div>
      </div>
      <div className="voting"></div>
    </>
  );
};

export default Proposal;
