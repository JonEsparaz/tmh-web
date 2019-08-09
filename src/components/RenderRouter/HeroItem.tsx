
import React from 'react';
import { Button } from 'reactstrap';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import PropTypes from "prop-types";
interface Props extends RouteComponentProps {
    data: any

}
interface State {
    data: any
}
class HeroItem extends React.Component<Props, State> {
    static contextTypes = {
        router: PropTypes.object,
        history: PropTypes.object
    }
    constructor(props: Props, context: any) {
        super(props, context);
        console.log(context);
        this.state = {
            data: props.data
        }
        this.navigate = this.navigate.bind(this);
    }
    navigate() {
        this.props.history.push("spirituality", "as")
        const unblock = this.props.history.block('Are you sure you want to leave this page?');
        unblock();

    }
    render() {
        if (this.state.data.style === "full") {
            return (
                <div className="headerItem" style={{ position: "relative", width: "100vw", height: "105vh", paddingBottom: "5vh" }}>
                    <img src={this.state.data.image1Src} alt={this.state.data.image1Alt} className="example-mask" style={{ width: "100vw", height: "100vh", zIndex: 50, objectFit: "cover", position: "absolute" }} />
                    <div style={{ position: "absolute", left: "20vw", top: "10vw", zIndex: 100 }}>
                        <h1 style={{ fontWeight: "bold", fontSize: "3vw" }}>{this.state.data.header1}</h1>
                        <h2>{this.state.data.header2}</h2>
                        <div style={{ width: "50vw", fontSize: "1.5vw" }}>{this.state.data.text1}</div>
                        <div style={{ fontSize: "1.5vw" }}>{this.state.data.text2}</div>
                        <Button onClick={this.navigate}>{this.state.data.button1Text}</Button>
                        <a href={this.state.data.link1Action}>{this.state.data.link1Text}</a>
                    </div>
                </div>

            )
        }
        else if (this.state.data.style === "partialNoFooter") {
            return (
                <div className="headerItem" style={{ position: "relative", left: "20vw", width: "80vw",height:"38vw", paddingBottom: "0vh" }}>
                    <img src={this.state.data.image1Src} alt={this.state.data.image1Alt} className="example-mask" style={{ width: "80vw", height:"40vw",  zIndex: 50, objectFit: "cover", position: "absolute" }} />
                </div>
            )
        }
        else return null
    }
}


export default withRouter(HeroItem)