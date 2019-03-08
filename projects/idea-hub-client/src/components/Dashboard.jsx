import React from 'react';
import PropTypes from 'prop-types';
import IdeaForm from './IdeaForm';
import { PageHeader, Tabs, Tab, Grid } from 'react-bootstrap';
 
function Dashboard(props, context) {
  //const web3Context = context.web3;
 
  /**
   * web3Context = {
   *   accounts: {Array<string>} - All accounts
   *   selectedAccount: {string} - Default ETH account address (coinbase)
   *   network: {string} - One of 'MAINNET', 'ROPSTEN', or 'UNKNOWN'
   *   networkId: {string} - The network ID (e.g. '1' for main net)
   * }
   */
 
  return (
    <Grid fluid={true}>
      <PageHeader>
        Idea Hub: <small>Submit and view ideas in OSO Idea Network</small>
      </PageHeader>
      <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
        <Tab eventKey={1} title="Submit an Idea">
          <IdeaForm />
        </Tab>
        <Tab eventKey={2} title="View your Ideas">
            Tab 2 content
        </Tab>
        <Tab eventKey={3} title="Explore the Idea network">
            Tab 3 content
        </Tab>
      </Tabs>
    </Grid>
  );
}
 
Dashboard.contextTypes = {
  web3: PropTypes.object
};
 
export default Dashboard;