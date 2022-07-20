import React, { useState, useEffect } from "react";
import "./pages.css";
import { Tag, Widget, Blockie, Tooltip, Icon, Form, Table } from "web3uikit";
import { Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { useMoralis } from "react-moralis";

const Proposal = () => {

  const { state: proposalDetails } = useLocation();
  const { Moralis, isInitialized } = useMoralis();
  const [latestVote, setLatestVote] = useState(0);
  const [percUp, setPercUp] = useState(0);
  const [percDown, setPercDown] = useState(0);
  const [votes, setVotes] = useState([]);


  useEffect(() => {
    if(isInitialized) {

      async function getVotes() {
        const Votes = Moralis.Object.extend("Votes");
        const query = new Moralis.Query(Votes);
        query.equalTo("proposal", proposalDetails.id);
        query.descending("createdAt");
        const results = await query.find();
        console.log(results);
        if(results.length > 0) {
          setLatestVote(results[0].attributes);
          setPercDown(
            (
              (Number(results[0].attributes.votesDown) /
                (Number(results[0].attributes.votesDown) + 
                  (Number(results[0].attributes.votesUp)))) *
              100
            ).toFixed(0)
          );
          setPercUp(
            (
              (Number(results[0].attributes.votesUp) /
                (Number(results[0].attributes.votesDown) + 
                  (Number(results[0].attributes.votesUp)))) *
              100
            ).toFixed(0)
          );
        }

        const votesDirection = results.map((e) => [
          e.attributes.voter,
          <Icon 
            fill={e.attributes.votedFor ? "#2cc40a" : "#d93d3d"}
            size={24}
            svg={e.attributes.votedFor ? "checkmark" : "arrowCircleDown"}
          />,
        ]);

        setVotes(votesDirection)
      }
      getVotes();
    }
  }, [isInitialized])

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
          <div>{ proposalDetails.description }</div>
          <div className="proposalOverview">
            <Tag color={proposalDetails.color} text={proposalDetails.text} />
            <div className="proposer">
              <span>Proposed By</span>
              <Tooltip content={proposalDetails.proposer}>
                <Blockie seed={proposalDetails.proposer} />
              </Tooltip>
            </div>
          </div>
        </div>
        {latestVote && (
          <div className="widgets">
            <Widget info={latestVote.votesUp} title="Votes for">
              <div className="extraWidgetInfo">
                <div className="extraTitle">{percUp}%</div>
                <div className="progress">
                  <div 
                    className="progressPercentage"
                    style={{width: `${percUp}%`}}>
                  </div>
                </div>
              </div>
            </Widget>
            <Widget info={latestVote.votesDown} title="Votes against">
              <div className="extraWidgetInfo">
                <div className="extraTitle" style={{color: 'red'}}>{percDown}%</div>
                <div className="progress">
                  <div 
                    className="progressPercentage"
                    style={{width: `${percDown}%`, backgroundColor: 'red'}}>
                  </div>
                </div>
              </div>
            </Widget>
          </div>
        )}
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
