import * as React from 'react';
import { render } from 'react-dom';
import App from './App';
import './scss/app';
import {ReactServerGatewayImpl} from "./react-server-gateway-impl";
import {ServerProvider} from "../business/server-provider";

ServerProvider.ServerGateway = new ReactServerGatewayImpl()
render(<App />, document.getElementById("root"));
