import React from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import FloatLabel from '../FloatLabel';

const { Paragraph } = Typography;

interface ForgotPasswordFormProps {
    onBackToLoginClick: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBackToLoginClick }) => {
    const { t } = useTranslation();

    const onFinish = (values: any) => {
        console.log('Forgot password form values:', values);
    };

    return (
        <div>
            <Paragraph style={{ textAlign: 'center', marginBottom: 24 }}>
                {t('auth.forgot_password.description')}
            </Paragraph>

            <Form
                name="forgot_password"
                onFinish={onFinish}
                layout="vertical"
                size="large"
            >
                <Form.Item
                    name="email"
                    rules={[
                        { required: true, message: t('auth.forgot_password.email_required') },
                        { type: 'email', message: t('auth.forgot_password.email_invalid') }
                    ]}
                >
                    <FloatLabel label={t('auth.forgot_password.email_label')} name="email">
                        <Input prefix={<MailOutlined />} />
                    </FloatLabel>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        {t('auth.forgot_password.submit_btn')}
                    </Button>
                </Form.Item>

                <div style={{ textAlign: 'center' }}>
                    <Button type="link" onClick={onBackToLoginClick}>
                        {t('auth.forgot_password.back_to_login_link')}
                    </Button>
                </div>
            </Form>
        </div>
    );
};
