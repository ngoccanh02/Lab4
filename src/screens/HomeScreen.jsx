import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { IconButton, List, Text } from 'react-native-paper';
import { useMyContextController } from '../context';
import firestore from '@react-native-firebase/firestore';

const HomeScreen = ({ navigation }) => {
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;

  const [serviceList, setServiceList] = useState([]);

  const fetchData = async () => {
    try {
      const servicesSnapshot = await firestore().collection('services').get();
      const servicesData = servicesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setServiceList(servicesData);
    } catch (error) {
      console.error('Error fetching services: ', error);
    }
  };

  useEffect(() => {
    if (userLogin == null) {
      fetchData();
      navigation.navigate('Login');
    } else {
      fetchData();
    }
  }, [userLogin, navigation]);

  const navigateToEditService = (service) => {
    navigation.navigate('EditService', {
      serviceId: service.id,
      serviceName: service.serviceName,
      price: service.price,
    });
  };

  const navigateToServiceDetail = (service) => {
    navigation.navigate('ServiceDetail', {
      serviceName: service.serviceName,
      price: service.price,
      creator: service.creator,
      time: service.time,
      final: service.final,
      // Add more parameters as needed
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'lightgrey' }}>
      <View
        style={{
          backgroundColor: 'blue',
          height: 100,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ color: 'yellow', fontSize: 24, fontWeight: 'normal' }}>
          {userLogin != null && userLogin.name.toUpperCase()}
        </Text>
        <IconButton icon="account-circle" size={40} iconColor="white" onPress={() => {}} />
      </View>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View
          style={{
            height: 50,
            backgroundColor: 'green',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>
            Danh Sách Dịch Vụ
          </Text>
          <IconButton
            icon="plus-circle"
            size={40}
            iconColor="white"
            onPress={() => navigation.navigate('AddNewService')}
          />
        </View>
        <FlatList
          data={serviceList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <List.Item
              title={item.serviceName}
              description={`Giá: ${item.price}`}
              onPress={() => navigateToServiceDetail(item)}
              style={styles.listItem}
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: 'violet',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(70, 0, 0, 0.05)', // Adjusted color and transparency
    borderRadius: 5,
  },
});

export default HomeScreen;
