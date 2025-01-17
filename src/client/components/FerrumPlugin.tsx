import { Component, ReactElement } from "react";
import { toast, Toaster } from "react-hot-toast";
import Axios from "axios";

import {
    FerrumPluginProps,
    FerrumPluginState,
    FerrumPluginOption,
    GetDataUrlResponse 
} from "../types";
import * as config from "../../config.json";
import { apiUrl } from "../global";

const root = config.explorer.root;

export default abstract class FerrumPlugin extends Component<FerrumPluginProps, FerrumPluginState> {
    private path: string;
    protected option: FerrumPluginOption;
    protected showMsgbox: typeof toast = toast;
    
    public constructor(props: FerrumPluginProps, option: FerrumPluginOption) {
        super(props);

        this.state = {
            viewerComponent: null
        };

        this.option = option;
        this.path = root + this.props.path.replaceAll("\\", "/");
    }

    public abstract viewerRender(dataUrl: string): ReactElement;

    private fetchData(): void {
        Axios.get(apiUrl +"/getDataUrl?path="+ this.path.replaceAll("/", "\\"))
            .then((res: GetDataUrlResponse) => {
                if(res.data.err == 404) {
                    toast.error("无法找到指定文件");
                    return;
                }

                this.setState({
                    viewerComponent: this.viewerRender(res.data.bdata)
                });
            })
            .catch((err) => {throw err});
    }

    public render(): ReactElement {
        return (
            <div className={this.option.name +" viewer"}>
                <div className="main-container">
                    <div className="toast-container">
                        <Toaster/>
                    </div>
                    <div className="header-container">
                        <h1>{this.option.title}</h1>
                        <p>路径: {this.props.path}</p>
                    </div>
                    <div className="viewer-container">{this.state.viewerComponent}</div>
                </div>
            </div>
        );
    }

    public componentDidMount(): void {
        this.fetchData();
    }
}
