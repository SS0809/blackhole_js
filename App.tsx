import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Image,
  Linking,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { encode } from 'base-64';


type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}






function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://k1qsh8ytwc.execute-api.ap-southeast-2.amazonaws.com/default/TELECORE?limit=30&movies=true');
        setData(response.data);
      } catch (error) {
        //setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once after the initial render
  const teleOpenUrl = (data) => {
    const str = 'text=' + data;
    const encodedStr = encode(str);
    const openUrl = 'https://t.me/blackhole_movie_bot?start=' + encodedStr;
  
    console.log('Generated URL:', openUrl);
  
    Linking.openURL(openUrl)
      .then(() => console.log('URL opened successfully'))
      .catch((error) => console.error('Error opening URL:', error));
  };



  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          {loading && (
            <Section title="Loading">
              <Text>Loading...</Text>
            </Section>
          )}

          {/* Dynamic Sections */}
          {data && data.map((item, index) => (
          <Section key={index} title={item.movie_name}>
            <Image
                source={{uri: "https://ucarecdn.com/"+item.img_data[index]+"/"}}
                style={{width: 100, height: 80}}
              />
            <Button
                onPress={ ()=>{teleOpenUrl(item.telegram)}}
               title="Download from telegram"
               color="#841584"
             />
            <Text>Size: {item.size_mb}(MB)</Text>
          </Section>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
