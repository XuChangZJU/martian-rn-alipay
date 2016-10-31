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
import { signOrderString } from './sign'
export default class TestPay extends Component {
    goAlipay () {
     let string = signOrderString(this.state.text);
    const data = "";
    Alipay.pay(data).then((msg) => {
        console.log(msg);
    }, (e) => {
        console.log(e);
    });
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
                   value={this.state.text}  
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

