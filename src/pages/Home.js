import React, { useEffect, useState } from "react";
import "./pages.css";
import { Tab, TabList, Widget, Tag, Table, Form } from "web3uikit";
import { Link } from 'react-router-dom';
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction } from "react-moralis";

const Home = () => {

  const [passRate, setPassRate] = useState(0);
  const [totalP, setTotalP] = useState(0);
  const [counted, setCounted] = useState(0);
  const [voters, setVoters] = useState(0);
  const { Moralis, isInitialized } = useMoralis();
  const [proposals, setProposals] = useState([]);
  const Web3Api = useMoralisWeb3Api();
  const [sub, setSub] = useState();
  const contractProcessor = useWeb3ExecuteFunction();

  async function createProposal(newProposal) {
    let options = {
      contractAddress: "0x2977343b18254C555ED86dAe95717990716E92A9",
      functionName: "createProposal",
      abi: [
          {
            "inputs":[
              {
                "internalType":"string",
                "name":"_description",
                "type":"string"
              },
              {
                "internalType":"address[]",
                "name":"_canVote",
                "type":"address[]"
              }
            ],
            "name":"createProposal",
            "outputs":[],
            "stateMutability":"nonpayable",
            "type":"function"
          }
      ],
      params: {
        _description: newProposal,
        _canVote: voters,
      }
    };

    await contractProcessor.fetch({
      params: options,
      onSuccess: () => {
        console.log("Proposal successfully created.");
        setSub(false);
      },
      onError: (error) => {
        alert(error.data.message);
        setSub(false);
      }
    })
  }

  async function getStatus(proposalId) {
    const ProposalCounts = Moralis.Object.extend("ProposalCounts");
    const query = new Moralis.Query(ProposalCounts);
    query.equalTo("uid", proposalId);
    const result = await query.first();
    // console.log(result);

    if(result !== undefined) {
      if(result.attributes.passed) {
        return {color: 'green', text: 'Passed'};
      } else {
        return {color: 'red', text: 'Rejected'};
      }
    } else {
      return {color: 'blue', text: 'Ongoing'};
    }
  }

  useEffect(() => {
    if(isInitialized) {

      async function getProposals() {
        const Proposals = Moralis.Object.extend("Proposals");
        const query = new Moralis.Query(Proposals);
        query.descending("uid_decimal");
        const results = await query.find();
        const table = await Promise.all(
          results.map(async (e) => [
            e.attributes.uid,
            e.attributes.description,
            <Link to="/proposal" state={{
              description: e.attributes.description,
              color: (await getStatus(e.attributes.uid)).color,
              text: (await getStatus(e.attributes.uid)).text,
              id: e.attributes.uid,
              proposer: e.attributes.proposer
            }}>
              <Tag 
                color={(await getStatus(e.attributes.uid)).color}
                text={(await getStatus(e.attributes.uid)).text}
              />
            </Link>
          ])
        );
        setProposals(table);
        setTotalP(results.length);
      }

      async function passRate() {
        const ProposalCounts = Moralis.Object.extend("ProposalCounts");
        const query = new Moralis.Query(ProposalCounts);
        const results = await query.find();
        let votesUp = 0;
        
        results.forEach((e) => {
          if(e.attributes.passed) {
            votesUp++;
          }
        });

        setCounted(results.length);
        setPassRate((votesUp/results.length) * 100);
      }

      const fetchTokenIdOwners = async () => {
        const options = {
          address: "0x2953399124F0cBB46d2CbACD8A89cF0599974963",
          token_id:
            "49947751946628389830144382296876621757213005892257042905149060383620550623242",
          chain: "mumbai"
        };
        const tokenIdOwners = await Web3Api.token.getTokenIdOwners(options);
        const address = tokenIdOwners.result.map((e) => e.owner_of);
        // console.table(voters, address)
        setVoters(address);
      }

      fetchTokenIdOwners();
      getProposals();
      passRate();

    }
  }, [isInitialized])

  return (
    <>
      <div className="content">
        <TabList defaultActiveKey={1} tabStyle="bulbUnion">
          {proposals && (
            <Tab tabKey={1} tabName="Dao">
              <div className="tabContent">
                Governance Overview
                <div className="widgets">
                  <Widget
                    info={totalP}
                    title="Proposals Created"
                    style={{width: "200%"}}
                  >
                    <div className="extraWidgetInfo">
                      <div className="extraTitle">Pass Rate</div>
                      <div className="progress">
                        <div
                          className="progressPercentage"
                          style={{width: `${passRate}%`}}
                        ></div>
                      </div>
                    </div>
                  </Widget>
                  <Widget info={voters ? voters.length : 0} title="Eligible voters"/>
                  <Widget info={totalP ? (totalP - counted) : 0} title="Ongoing proposals"/>
                </div>
                Recent proposals
                <div style={{marginTop: "30px"}}>
                {/* {console.log(proposals)} */}
                  <Table
                    columnsConfig="10% 70% 20%"
                    data={proposals}
                    header={[
                      <span>ID</span>,
                      <span>Description</span>,
                      <span>Status</span>,
                    ]}
                    pageSize={5}
                  />
                </div>
                <Form 
                  buttonConfig={{
                    isLoading: sub,
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
                    setSub(true);
                    createProposal(e.data[0].inputResult);
                  }}
                  title="Create a New Proposal"
                />
              </div>
            </Tab>
          )}
          <Tab tabKey={2} tabName="Forum"></Tab>
          <Tab tabKey={3} tabName="Docs"></Tab>
        </TabList>
      </div>
      <div className="voting"></div>
    </>
  );
};

export default Home;
