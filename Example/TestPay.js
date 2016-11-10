/**
 * Created by Administrator on 2016/10/29.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    NativeAppEventEmitter,
} from 'react-native';
import Alipay from 'martian-rn-alipay';

const url = "http://192.168.10.103:2005";
// const url = "http://10.180.70.212:2005";
export default class TestPay extends Component {

    goAlipay () {
        if(this.state && this.state.text && parseInt(this.state.text) !== NaN) {
            fetch(url + `?totalAmount=${this.state.text}`)
                .then(
                    (res) => {
                        res.text()
                            .then(
                                (text) => {
                                    Alipay.pay({
                                        orderInfo: text
                                    })
                                        .then(
                                            (result)=>{
                                                console.log(result);
                                                alert('success!!');
                                        }
                                        )
                                        .catch(
                                            (err)=>{
                                            console.log(err)
            }
                                        );
                                }
                            );
                    }
                )
                .catch(
                    console.warn
                );
        }
        else {
            alert("请输入合法的金额")
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    点击进入支付宝支付
                </Text>
                <Text style={styles.instructions}>
                    具体参数请在页面中配置
                </Text>
                <View
                    style={styles.inputBox}
                >
                    <View style={{ flex: 1 }}>
                        <TextInput
                            ref="inputText"
                            // keyboardShouldPersistTaps={false}
                            // onEndEditing={() => {}}
                            multiline={true}
                            onChangeText={(text) => this.setState({ text })}
                            style={[styles.replyText, styles.replyTextTwo]}
                            defaultValue={this.state && this.state.text || undefined}
                            underlineColorAndroid="transparent"
                            placeholder="请输入总金额"
                            keyboardType='numeric'
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={this.goAlipay.bind(this)}>
                        <Text style={styles.buttonText}>去支付</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    replyBox: {
        alignItems: 'flex-end',
    },
    inputBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: 'whitesmoke',
        paddingRight: 13,
        paddingLeft: 13,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    replyTextTwo: {
        height: 50,
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

