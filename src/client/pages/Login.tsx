import { Component, ReactElement } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Button, Form } from "react-bootstrap";

import Utils from "../../Utils";
import { LoginPanelState } from "../types";
import * as config from "../../config.json";
import md5 from "md5-node";

const cookieKey = "fepw";

export default class Login extends Component<{}, LoginPanelState> {
    private passwordInput: HTMLInputElement | null = null;

    public constructor(props: {}) {
        super(props);

        this.state = {
            isEnterDisabled: true
        };
    }

    private async handleLogin(): Promise<void> {
        if(!this.passwordInput) return;
        if(this.passwordInput.value.length == 0) return;

        var password = this.passwordInput.value;

        if(md5(password) === config.explorer.password) {
            Utils.setCookie(cookieKey, md5(md5(password))); // The value that store into cookie has been double-md5ed

            toast.success("登录成功");
            await Utils.sleep(500);
            window.location.reload();
        } else {
            toast.error("密码错误");
        }
    }

    private handleInputChange(): void {
        if(!this.passwordInput) return;

        this.setState({
            isEnterDisabled: this.passwordInput.value.length == 0
        });
    }

    public render(): ReactElement {
        return (
            <div className="login-panel">
                <div className="toast-container">
                    <Toaster position="bottom-right"/>
                </div>
                <div className="main-container">
                    <div className="header-container">
                        <img className="icon" src="/icon.png" alt="icon" title="Ferrum Explorer"/>
                        <h1 className="title">Ferrum 登录</h1>
                    </div>
                    <div className="input-container">
                        <Form>
                            <Form.Control
                                type="password"
                                placeholder="输入密码"
                                autoComplete="off"
                                onChange={() => this.handleInputChange()}
                                ref={(r: HTMLInputElement | null) => this.passwordInput = r}/>
                            <Button
                                onClick={() => this.handleLogin()}
                                disabled={this.state.isEnterDisabled}>登录</Button>
                        </Form>
                    </div>
                </div>
                <div className="footer-container">
                    <p>
                        Ferrum Explorer - <a href="https://github.com/NriotHrreion/ferrum" target="_blank" rel="noreferrer">Github Repo</a>
                        <object data="https://img.shields.io/github/stars/NriotHrreion/ferrum.svg?style=social&label=Star" aria-label="Github Stars"></object>
                    </p>
                    <p className="copy-info">Copyright (c) NriotHrreion {new Date().getFullYear()}</p>
                </div>
            </div>
        );
    }

    public componentDidMount(): void {
        document.body.addEventListener("keydown", (e: KeyboardEvent) => {
            if(e.key == "Enter") {
                this.handleLogin();
            }
        });
    }
}
