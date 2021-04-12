/**
 * @file 服务协议与隐私政策Modal
 * @module pages/article/components/modal
 * @author twenty-four K <https://github.com/xiaobinwu>
 */

import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Text } from '@app/components/common/text';
import { LANGUAGE_KEYS } from '@app/constants/language';
import i18n from '@app/services/i18n';
import colors from '@app/style/colors';
import sizes from '@app/style/sizes';
import mixins from '@app/style/mixins';
import Modal from 'react-native-modal';
import fonts from '@app/style/fonts';
import { ArticleRoutes } from '@app/constants/routes';

export interface IModalProps {
    isVisible: boolean;
    onReject: () => void;
    onAgree: () => void;
    navigateTo: (data: string) => void;
}


@observer 
class AgreementModal extends PureComponent<IModalProps> {
    render() {
        const { styles } = obStyles;
        return (
            <Modal isVisible={this.props.isVisible}>
                <View style={styles.modal}>
                    <Text style={styles.modalTitle}>{i18n.t(LANGUAGE_KEYS.AGREEMENTTITLE)}</Text>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalContentText}>
                            {i18n.t(LANGUAGE_KEYS.AGREEMENTCONTENT1)}
                            <Text style={styles.modalLink} onPress={() => {
                                this.props.navigateTo(ArticleRoutes.ArticleProtocol);
                            }}>《{i18n.t(LANGUAGE_KEYS.PROTOCOL)}》</Text>
                            {i18n.t(LANGUAGE_KEYS.AGREEMENTCONTENT2)}
                            <Text style={styles.modalLink} onPress={() => {
                                this.props.navigateTo(ArticleRoutes.ArticlePrivacy);
                            }}>《{i18n.t(LANGUAGE_KEYS.PRIVACY)}》</Text>
                            {i18n.t(LANGUAGE_KEYS.AGREEMENTCONTENT3)}
                        </Text>
                    </View>
                    <View style={styles.modalButtonContainer}>
                        <Text style={[styles.modalButton]} onPress={this.props.onReject}>{i18n.t(LANGUAGE_KEYS.AGREEMENTBUTTON1)}</Text>
                        <Text style={[styles.modalButton, styles.modalOkButton]} onPress={this.props.onAgree}>{i18n.t(LANGUAGE_KEYS.AGREEMENTBUTTON2)}</Text>
                    </View>
                </View>
            </Modal>
        );
    }
}



const obStyles = observable({
    get styles() {
        return StyleSheet.create({
            modal: {
                marginHorizontal: '10%',
                width: '80%',
                backgroundColor: '#fff',
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 20,
            },
            modalTitle: {
                ...fonts.h2,
                color: colors.textTitle,
                marginBottom: 10
            },
            modalContent: {
                padding: 20,
            },
            modalContentText: {
                ...fonts.h3,
                color: colors.textDefault
            },
            modalLink: {
                color: colors.primary
            },
            modalBorder: {
                width: sizes.borderWidth,
                height: sizes.gap * 2,
                backgroundColor: colors.border
            },

            modalButtonContainer: {
                ...mixins.rowCenter,
                justifyContent: 'space-around',
                borderColor: colors.border,
                borderTopWidth: sizes.borderWidth
            },
            modalButton: {
                width: '50%',
                height: 80,
                textAlign: 'center',
                ...fonts.h2,
                lineHeight: 80,
            },
            modalOkButton: {
                color: colors.primary
            }
        });
    }
});


export default AgreementModal;
