import { useFocusEffect } from '@react-navigation/native';
import { Container } from 'native-base';
import React from 'react';
import { BackHandler, ScrollView, StyleSheet, Text, View } from 'react-native';
// import { pricacytext } from '../data/privacytext';

const PrivacyPolicy = ({ navigation }) => {
  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        navigation.navigate('Setting')
      };
      BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', backAction);
      };
    }, []),
  );

  return (
    <Container style={{ marginTop: 22, flex: 1 }}>
      <Text> Book Champ Privacy Policy</Text>
      <ScrollView>
        <View>
          <Text>31st October, 2021</Text>
          <Text>BOOK CHAMP – PRIVACY POLICY</Text>
          <Text style={styles.bold}>About Book Champ</Text>
          <Text>
            {`        JVEC Solutions is the developer, operator and publisher of onlinegames for the web and mobile, in various platforms and devices. The Company operates, among others, the mobile application for android of the app “Book Champ”, and also the website https://www.book-champ.com.            
`}
          </Text>
          <Text style={styles.bold}>{`Who are we?`}</Text>
          <Text>
            {`      JVEC Solutions is the developer and operator of the platforms, including the website and all services supplied by it (all, the ” Platform”).
`}
          </Text>
          <Text style={styles.bold}>{`What’s this Privacy Policy about`}</Text>
          <Text>
            {`      We have created this Privacy Policy because we highly evaluate yourPersonal Data and information. Please read it, as it includesimportant information in respect to your Personal Data and information.`}
          </Text>
          <Text>
            {`
 We make our best efforts to protect our users’ privacy, and to be compatible with privacy protection laws and regulations, including the Nigerian Data Protection Regulation (the “NDPR”). We have created this document and our privacy practices with great efforts to comply with the NDPR. Please read this Privacy Policy carefully. For any questions or concerns, please contact us via our email address: info@jvecsolutions.com.`}
          </Text>
          <Text style={styles.bold}>
            {`
Consent : By using the Platform or allowing someone else to use it on your behalf, you give your consent to our collection, use, disclosure, transfer and storage of any Personal Data and information received by us as a result of such use, in accordance with this Privacy Policy.`}
          </Text>
          <Text>{`
          Be advised that under the NDPR, our classification is of a Controller of the Personal Data provided to us by you. As such, we will make our best efforts to make sure that the following shall apply to your Personal Data we hold:
1. We shall use it lawfully, fairly and transparently.
2. We shall collect it for specific and legitimate purposes.
3. We shall limit the amount of Personal Data to be adequate and relevant.
4. It shall be as accurate and up-to-date as possible.
5. We shall limit the possibility of your identification to the minimum possible.
6. We shall keep it secure.
          `}</Text>
          <Text style={styles.bold}>{`Which Information do we collect?`}</Text>
          <Text>{`1. Personal Data`}</Text>
          <Text style={styles.bold}>{`How do we use your Information?`}</Text>
          <Text>{`
1. Personal Data
Any Personal Data we collect is being used in a way that is consistent with this Privacy Policy, and may be used as follows:
a. Access and Use: Any Personal Data provided to us by you in order to obtain access to any functionality of the Platform may be used by us in order to provide you with access to the required functionality and to monitor your use of such functionality.
b. Company’s Business Purposes: Any Personal Data provided to us by you may be used by us in order to help us improve the functionality of the Platform, to better understand our users, to protect against, identify or address wrongdoing, to enforce our Terms of Use, and to generally manage the Platform and our business.
c. A Specific Reason: Any Personal Data provided to us by you for a specific reason may be used by us in connection with that specific reason.
d. Marketing: Any Personal Data provided to us by you may be used by us to contact you in the future for our marketing and advertising purposes, including without limitation to inform you about new services or Platforms we believe might be of interest to you, and to develop promotional or marketing materials and provide those materials to you.
e. Statistics: Any Personal Data provided to us by you may be used by us for statistical reports containing aggregated information.

2. Non-Personal Data
Since Non-Personal Data cannot be used to identify you in person, we may use such data in any way permitted by law.
          `}</Text>
          <Text>{`General Terms for Data Transfer
Please be advised as your Personal Data may be kept, processed or transferred to servers located outside the country that you live in. We shall keep records of all activities relevant to Personal Data transfer, as required by the NDPR. We shall only transfer your Personal Data to companies that apply to the conditions set forth in the NDPR, subject to your consent to this Privacy Policy. Our cloud is hosted by Heroku in the United States, which is in compliance with the NDPR.
Duration of Data Retention
We shall retain your Personal Data and activity logs for at least 24 months after the last time you accessed the Services, unless you specifically request us to delete your Personal Data earlier, in such case we will delete it as requested.
Which Information do we share with Third Parties?
1. Personal Data
We have no intention of selling your Personal Data to any other third party.However, naturally, there are circumstances in which we may disclose, share or transfer your Personal Data, without a further notice, as follows:
a. Required by Law – If we believe in good faith that disclosure is required by law, including but not limited to, orders by any governmental entity, court or any other judicial entity, in any jurisdiction.
b. To Prevent Wrongdoing – If we believe in good faith that disclosure is required in order to prevent any kind of illegal activity, fraud or civil wrong.
c. Business Purposes: As we develop our business, we might sell or buy businesses or assets. In the event of a corporate sale, merger, reorganization, dissolution or similar event, Personal Data may be part of the transferred assets. You acknowledge and agree that any successor to or acquirer of the Company (or its assets) will continue to have the right to use your Personal Data and information in accordance with the terms of this Privacy Policy.
2. Non-Personal Data
Since Non-Personal Data cannot be used to identify you in person, we may disclose such data in any way permitted by law.

Links to Other Websites
Book Champ may contain links to other websites and/or third-party services. We are not responsible for the privacy policies of such websites and/or services, and we advise you to review their privacy policies.
Storage and Security
We are strongly committed to the protection of your Personal Data and information, and we will take reasonable technical steps, which are accepted in our industry, to keep your Information secure and protect it from loss, misuse or alteration. However, if you notice a risk or any security violations, we advise you to report to us on info@jvecsolutions.com, so we can resolve it as soon as possible.
Other Terms

1. Changes to This Privacy Policy
The Platform and our business may change from time to time. As a result, at times, it may be necessary for us to make changes to this Privacy Policy. We reserve the right, in our sole discretion, to update or modify this Privacy Policy at any time (collectively, “Modifications”). Modifications to this Privacy Policy will be displayed by the “Last Updated” date at the top of this Privacy Policy. Please review this Privacy Policy periodically, and especially before you provide any Personal Data or information. This Privacy Policy was last updated on the date indicated above. Your continued use of the Services following the effectiveness of any Modifications to this Privacy Policy constitutes acceptance of those Modifications. If any Modification to this Privacy Policy is not acceptable to you, your sole remedy is to cease accessing, browsing and otherwise using the Platform.

2. Direct Messages
a. The Company may send you, from time to time, information regarding its services, including advertisements, via short messages or emails.
b. By using the Platform, including providing your phone number or email address, you explicitly consent to receive such messages. However, at any time you may inform us of your removing such consent, by sending proper email to: info@jvecsolutions.com. We may, however, send direct messages we believe are critical for your use of the platform, even following your choice to unsubscribe.

3. Cookies
a. We may use Cookies for the proper and continuous operation of the Platform or website, including collection of statistics, verifications, modifications etc.

4. Third Party’s Advertisements
a. As part of the services, some third party’s advertisements may appear on the Platform or website. Such advertisements are provided by an external supplier which adapt content according to the user’s habits. 
b. Such third-party services may use Cookies. It is hereby clarified that such services are subject to the third party’s privacy policy and not to this document.

5. Dispute Resolution:
The laws of Lagos State shall govern this Privacy Policy. Any dispute which may arise in connection with this Privacy Policy shall be brought to the competent court in Lagos State, Nigeria, which shall be granted exclusive jurisdiction.

Contact Information:
JVEC Solutions,
<<<<<<< HEAD
No. 39, Oluwaseun Street, Ikotun, Lagos state.
=======
No. 12, Rev. Ogunbiyi Street, Ikeja GRA, Lagos, Nigeria.
>>>>>>> ec0e7d37058966a5beb01baac05f5d7a1273ab6b
If you have any questions about this Policy, please contact us at info@jvecsolutions.com
          `}</Text>
        </View>
      </ScrollView>
    </Container>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  bold: {
    fontWeight: 'bold',
  },
});
