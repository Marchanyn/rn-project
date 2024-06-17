import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  Button,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

function Exx({route, navigation}) {
  const [input1, setinput1] = useState('');
  const [input2, setinput2] = useState('');
  const [valueOfExpenens, setValueOfExpenens] = useState('');
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChange = (event, selectedDate) => {
    setSelectedDate(selectedDate);
    setShowDatePicker(false);
  };

  const handleSavePress = async () => {
    if (input2 == '') {
      Alert.alert('', 'Введите сумму расходов');
      return;
    } else if (valueOfExpenens == '') {
      Alert.alert('', 'Введите категорию трат');
      return;
    }

    const data = {
      title: input1,
      descr: parseInt(input2, 10),
      typeOfExpenens: valueOfExpenens,
      timestamp: selectedDate.getTime(),
    };

    const oldData = await AsyncStorage.getItem('tasks');
    const newData = oldData ? JSON.parse(oldData).concat(data) : [data];

    await AsyncStorage.setItem('tasks', JSON.stringify(newData));
    setTasks(newData);
    navigation.goBack();
  };

  const handleDatePress = () => {
    setShowDatePicker(() => !showDatePicker);
  };

  const {colorScheme} = route.params;

  const sortedTasks = tasks.sort((a, b) => {
    const aDate = new Date(a.timestamp);
    const bDate = new Date(b.timestamp);
    return aDate - bDate;
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#e4e8e9',
      }}>
      <View style={[styles.home]}>
        <TextInput
          onChangeText={text => setinput2(text)}
          style={[
            styles.textstyle,
            {color: String(colorScheme) === 'dark' ? 'white' : '#1f1f1f'},
          ]}
          keyboardType="numeric"
          placeholder="0"></TextInput>

        <TextInput
          onChangeText={text => setinput1(text)}
          style={[
            styles.textstyle,
            {color: String(colorScheme) === 'dark' ? 'white' : '#1f1f1f'},
          ]}
          placeholder="Комментарий"></TextInput>

        <TouchableOpacity onPress={handleDatePress}>
          <Text style={[styles.textstyle, {color: 'black'}]}>
            {selectedDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            onChange={onChange}
            minimumDate={new Date(2000, 1, 1)}
          />
        )}

        <Picker
          style={{width: '80%', height: 40}}
          selectedValue={valueOfExpenens}
          onValueChange={text => setValueOfExpenens(text)}
          numberOfLines={1}>
          <Picker.Item label="Транспорт" value="Транспорт" />
          <Picker.Item label="Продукты" value="Продукты" />
          <Picker.Item label="Дом" value="Дом" />
          <Picker.Item label="Кафе" value="Кафе" />
          <Picker.Item label="Здоровье" value="Здоровье" />
          <Picker.Item label="Другое" value="Другое" />
        </Picker>
      </View>

      <View style={[styles.but]}>
        <Button
          color={String(colorScheme) === 'dark' ? 'white' : '#1f1f1f'}
          title="Внести"
          onPress={handleSavePress}
        />
      </View>

      <View style={[styles.list]}>
        <FlatList
          data={sortedTasks}
          renderItem={({item}) => (
            <View style={[styles.listItem]}>
              <Text style={[styles.listText]}>{item.title}</Text>
              <Text style={[styles.listText]}>{item.descr}</Text>
              <Text style={[styles.listText]}>{item.typeOfExpenens}</Text>
              <Text style={[styles.listText]}>
                {new Date(item.timestamp).toLocaleString()}
              </Text>
            </View>
          )}
          keyExtractor={item => item.timestamp}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  home: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  textstyle: {
    fontSize: 24,
  },
  but: {
    margin: 30,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  list: {
    flex: 1,
    padding: 10,
  },
  listItem: {
    backgroundColor: '#e4e8e9',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  listText: {
    fontSize: 18,
    marginVertical: 2,
  },
});

export default Exx;
