import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";

import gql from "graphql-tag";
import { Query } from "react-apollo";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};

const GET_MONTHLY_CONSUMPTION = gql`
  {
    LabsoftMonthConsumption {
      month
      average
    }
  }
`;

function TableList(props) {
  const { classes } = props;
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Consumo Mensal</h4>
            <p className={classes.cardCategoryWhite}>
              Total de cada mês
            </p>
          </CardHeader>
          <CardBody>
            <Query query={GET_MONTHLY_CONSUMPTION}>
              {({ loading, error, data }) => {
                if (loading) return "Carregando...";
                if (error) return `Error! ${error.message}`;

                return (
                  <Table
                    tableHeaderColor="primary"
                    tableHead={["No", "Mês", "Consumo"]}
                    tableData={data.LabsoftMonthConsumption.map((singleData, index) => {
                      return [index + 1, singleData.month, `${singleData.average.toFixed(2).replace(".", ",")} kWh`];
                    })}
                  />
                );
              }}
            </Query>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

export default withStyles(styles)(TableList);
