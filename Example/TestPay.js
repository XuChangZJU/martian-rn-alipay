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
} from 'react-native';
import Alipay from 'martian-rn-alipay';

const url = "http://10.214.147.155:2005";
export default class TestPay extends Component {

    goAlipay () {
        if(this.state && this.state.text && parseInt(this.state.text) !== NaN) {
            fetch(url + `?totalAmount=${this.state.text}`)
                .then(
                    (res) => {
                        console.warn(res);
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
                <TextInput  
                   style={{height: 40, borderColor: 'gray', borderWidth: 1}}  
                   onChangeText={(text) => this.setState({text})}  
                   value={this.state && this.state.text}
                 /> 
                <TouchableOpacity
                    style={styles.button}
                    onPress={this.goAlipay.bind(this)}>
                    <Text style={styles.buttonText}>去支付</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
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
