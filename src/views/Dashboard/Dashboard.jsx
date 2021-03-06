import React from "react";
import PropTypes from "prop-types";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import AccessTime from "@material-ui/icons/AccessTime";
import Battery80 from "@material-ui/icons/Battery80";
import CalendarViewDay from "@material-ui/icons/CalendarViewDay";
import Visibility from "@material-ui/icons/Visibility";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

import { dailySalesChart, emailsSubscriptionChart } from "variables/charts.jsx";

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

import gql from "graphql-tag";
import { Query } from "react-apollo";

const GET_CURRENT_POWER_CONSUMPTION = gql`
  {
    CurrentPowerConsumption {
      measurement
    }
  }
`;

const GET_LAST_MONTH_CONSUMPTION = gql`
  {
    LabsoftLastMonthConsumption {
      measurement
    }
  }
`;

const GET_CURRENT_MONTH_BILL_PREVIEW = gql`
  {
    LabsoftCurrentMonthBillPreview {
      month
      value
    }
  }
`;

const GET_DAILY_CONSUMPTION = gql`
  {
    LabsoftLastMonthDailyConsumption {
      averageConsumption {
        labels
        series
      }
      peakConsumption {
        labels
        series
      }
    }
  }
`;

class Dashboard extends React.Component {
  state = {
    value: 0
  };
  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };
  render() {
    const { classes } = this.props;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <Card>
              <CardHeader color="primary" stats icon>
                <CardIcon color="primary">
                  <Battery80 />
                </CardIcon>
                <p className={classes.cardCategory}>Consumo Atual</p>
                <Query
                  query={GET_CURRENT_POWER_CONSUMPTION}
                  pollInterval={2000}
                >
                  {({ loading, error, data }) => {
                    if (loading) return "Loading...";
                    if (error) return `Error! ${error.message}`;

                    return (
                      <h3 className={classes.cardTitle}>
                        {data.CurrentPowerConsumption.measurement}
                        &nbsp;<small>W</small>
                      </h3>
                    );
                  }}
                </Query>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <Update />
                  Atualizado
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={4}>
            <Card>
              <CardHeader color="info" stats icon>
                <CardIcon color="info">
                  <CalendarViewDay />
                </CardIcon>
                <p className={classes.cardCategory}>
                  Consumo Total do último mês
                </p>
                <Query query={GET_LAST_MONTH_CONSUMPTION}>
                  {({ loading, error, data }) => {
                    if (loading) return "Loading...";
                    if (error) return `Error! ${error.message}`;

                    return (
                      <h3 className={classes.cardTitle}>
                        {data.LabsoftLastMonthConsumption.measurement
                          .toFixed(2)
                          .replace(".", ",")}
                        &nbsp;<small>kWh</small>
                      </h3>
                    );
                  }}
                </Query>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <DateRange />
                  Últimos 30 dias
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={4}>
            <Card>
              <CardHeader color="warning" stats icon>
                <CardIcon color="warning">
                  <Visibility />
                </CardIcon>
                <p className={classes.cardCategory}>Previsão da Conta de Luz</p>
                <Query query={GET_CURRENT_MONTH_BILL_PREVIEW}>
                  {({ loading, error, data }) => {
                    if (loading) return "Loading...";
                    if (error) return `Error! ${error.message}`;

                    return (
                      <h3 className={classes.cardTitle}>
                        <small>R$</small>
                        {data.LabsoftCurrentMonthBillPreview.value
                          .toFixed(2)
                          .replace(".", ",")}
                        &nbsp;
                      </h3>
                    );
                  }}
                </Query>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <LocalOffer />
                  Baseado na média dos últimos dias
                </div>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
        <Query query={GET_DAILY_CONSUMPTION}>
          {({ loading, error, data }) => {
            if (error) return `Error! ${error.message}`;

            return (
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <Card chart>
                    <CardHeader color="success">
                      {loading ? "Carregando..." :
                        <ChartistGraph
                          className="ct-chart"
                          data={{
                            labels: data.LabsoftLastMonthDailyConsumption.averageConsumption.labels,
                            series: [data.LabsoftLastMonthDailyConsumption.averageConsumption.series]
                          }}
                          type="Line"
                          options={dailySalesChart.options}
                          listener={dailySalesChart.animation}
                        />
                      }
                    </CardHeader>
                    <CardBody>
                      <h4 className={classes.cardTitle}>Média de consumo diário</h4>
                      <p className={classes.cardCategory}>
                        Com base nos dados do mês passado. em kWh
                      </p>
                    </CardBody>
                    <CardFooter chart>
                      <div className={classes.stats}>
                        <AccessTime /> Atualizado
                      </div>
                    </CardFooter>
                  </Card>
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <Card chart>
                    <CardHeader color="warning">
                      {loading ? "Carregando..." :
                        <ChartistGraph
                          className="ct-chart"
                          data={{
                            labels: data.LabsoftLastMonthDailyConsumption.peakConsumption.labels,
                            series: [data.LabsoftLastMonthDailyConsumption.peakConsumption.series]
                          }}
                          type="Bar"
                          options={emailsSubscriptionChart.options}
                          responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                          listener={emailsSubscriptionChart.animation}
                        />
                      }
                    </CardHeader>
                    <CardBody>
                      <h4 className={classes.cardTitle}>Picos de consumo diários</h4>
                      <p className={classes.cardCategory}>
                        Baseado nos dias do último mês, em kW
                      </p>
                    </CardBody>
                    <CardFooter chart>
                      <div className={classes.stats}>
                        <Update /> Valores atualizados
                      </div>
                    </CardFooter>
                  </Card>
                </GridItem>
              </GridContainer>
            );
          }}
        </Query>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
