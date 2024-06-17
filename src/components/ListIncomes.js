import React, {useState, useEffect, useMemo} from 'react';
import {View, FlatList, Text, StyleSheet, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PieChart} from 'react-native-gifted-charts';
import {Picker} from '@react-native-picker/picker';

const daysInMonth = (month, year) => new Date(year, month, 0).getDate();
const daysInYear = year =>
  (year % 4 === 0 && year % 100 > 0) || year % 400 == 0 ? 366 : 365;
const currentDate = new Date();
const currentDayStart = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth(),
  currentDate.getDate(),
);
const currentWeekStart = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth(),
  currentDate.getDate() - currentDate.getDay() + 1,
);

const currentMonthStart = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth(),
  currentDate.getDate() - currentDate.getDate() + 1,
);
const currentYearStart = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth() - currentDate.getMonth(),
  currentDate.getDate() - currentDate.getDate() + 1,
);
let timeOfYear = currentYearStart.getTime();
let timeOfMonth = currentMonthStart.getTime();
let timeOfWeek = currentWeekStart.getTime();
let timeOfDay = currentDayStart.getTime();

const getDayIncomeTasks = tasks => {
  return tasks.filter(task => {
    const taskDate = new Date(task.timestamp);

    return taskDate >= timeOfDay && taskDate < timeOfDay + 1000 * 60 * 60 * 24;
  });
};

getWeekIncomeTasks = tasks => {
  return tasks.filter(task => {
    const taskDate = new Date(task.timestamp);

    return (
      taskDate >= timeOfWeek && taskDate < timeOfWeek + 7 * 24 * 60 * 60 * 1000
    );
  });
};

getMonthIncomeTasks = (tasks, currentDate) => {
  return tasks.filter(task => {
    const taskDate = new Date(task.timestamp);

    return (
      taskDate >= timeOfMonth &&
      taskDate <
        timeOfMonth +
          daysInMonth(
            new Date(timeOfMonth).getMonth() + 1,
            new Date(timeOfYear).getFullYear(),
          ) *
            24 *
            60 *
            60 *
            1000
    );
  });
};

getYearIncomeTasks = (tasks, currentDate) => {
  return tasks.filter(task => {
    const taskDate = new Date(task.timestamp);

    return (
      taskDate >= timeOfYear &&
      taskDate <
        timeOfYear +
          daysInYear(new Date(timeOfYear).getFullYear()) * 24 * 60 * 60 * 1000
    );
  });
};
switchOnIncomePervYear = () => {
  timeOfYear -=
    1000 * 60 * 60 * 24 * daysInYear(new Date(timeOfYear).getFullYear() - 1);
};

switchOnIncomeNextYear = () => {
  timeOfYear +=
    1000 * 60 * 60 * 24 * daysInYear(new Date(timeOfYear).getFullYear());
};
switchOnIncomePervMonth = () => {
  timeOfMonth -=
    1000 *
    60 *
    60 *
    24 *
    daysInMonth(
      new Date(timeOfMonth).getMonth(),
      new Date(timeOfYear).getFullYear(),
    );
};

switchOnIncomeNextMonth = () => {
  timeOfMonth +=
    1000 *
    60 *
    60 *
    24 *
    daysInMonth(
      new Date(timeOfMonth).getMonth() + 1,
      new Date(timeOfYear).getFullYear(),
    );
};

switchOnIncomePervWeek = () => {
  timeOfWeek -= 1000 * 60 * 60 * 24 * 7;
};

switchOnIncomeNextWeek = () => {
  timeOfWeek += 1000 * 60 * 60 * 24 * 7;
};

switchOnIncomePervDay = () => {
  timeOfDay -= 1000 * 60 * 60 * 24;
};
switchOnIncomeNextDay = () => {
  timeOfDay += 1000 * 60 * 60 * 24;
};
let selectedDate = '';
function Incomes() {
  const [tasks, setTasks] = useState([]);
  const [chartData, setChartData] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState('Total');

  const removeItem = async item => {
    const newTasks = tasks.filter(task => task.timestamp !== item.timestamp);
    setTasks(newTasks);
    await AsyncStorage.setItem('income', JSON.stringify(newTasks));
  };
  useEffect(() => {
    const getTasks = async () => {
      const tasksJson = await AsyncStorage.getItem('income');
      const tasksArray = tasksJson ? JSON.parse(tasksJson) : [];
      setTasks(tasksArray);

      const chartData = {};
      tasksArray.forEach(task => {
        if (!chartData[task.typeOfExpenens]) {
          chartData[task.typeOfExpenens] = 0;
        }
        chartData[task.typeOfExpenens] += task.descr;
      });
      setChartData(chartData);
    };

    getTasks();
  }, [tasks]);
  const getFilteredTasks = useMemo(() => {
    switch (selectedPeriod) {
      case 'Day':
        selectedDate =
          new Date(timeOfDay).getDate() +
          ' ' +
          new Date(timeOfDay)
            .toLocaleDateString('Ru', {month: 'long'})
            .charAt(0)
            .toUpperCase() +
          new Date(timeOfDay)
            .toLocaleDateString('Ru', {month: 'long'})
            .slice(1);
        return getDayIncomeTasks(tasks, currentDate);
      case 'Week':
        selectedDate =
          new Date(timeOfWeek).getDate() +
          ' ' +
          new Date(timeOfWeek)
            .toLocaleDateString('Ru', {month: 'long'})
            .charAt(0)
            .toUpperCase() +
          new Date(timeOfWeek)
            .toLocaleDateString('Ru', {month: 'long'})
            .slice(1, 3) +
          ' - ' +
          new Date(timeOfWeek + 1000 * 60 * 60 * 24 * 7).getDate() +
          ' ' +
          new Date(timeOfWeek + 1000 * 60 * 60 * 24 * 7)
            .toLocaleDateString('Ru', {month: 'long'})
            .charAt(0)
            .toUpperCase() +
          new Date(timeOfWeek + 1000 * 60 * 60 * 24 * 7)
            .toLocaleDateString('Ru', {month: 'long'})
            .slice(1, 3);
        return getWeekIncomeTasks(tasks, currentDate);
      case 'Month':
        selectedDate =
          new Date(timeOfMonth)
            .toLocaleDateString('Ru', {
              month: 'long',
            })
            .charAt(0)
            .toUpperCase() +
          new Date(timeOfMonth)
            .toLocaleDateString('Ru', {
              month: 'long',
            })
            .slice(1);

        return getMonthIncomeTasks(tasks, currentDate);
      case 'Year':
        selectedDate = new Date(timeOfYear).getFullYear();
        return getYearIncomeTasks(tasks, currentDate);
      default:
        selectedDate = '';
        return tasks;
    }
  }, [selectedPeriod, tasks, currentDate]);

  const getPervPeriod = () => {
    switch (selectedPeriod) {
      case 'Day':
        return switchOnIncomePervDay();
      case 'Week':
        return switchOnIncomePervWeek();
      case 'Month':
        return switchOnIncomePervMonth();
      case 'Year':
        return switchOnIncomePervYear();
    }
  };
  const getNextPeriod = () => {
    switch (selectedPeriod) {
      case 'Day':
        return switchOnIncomeNextDay();
      case 'Week':
        return switchOnIncomeNextWeek();
      case 'Month':
        return switchOnIncomeNextMonth();
      case 'Year':
        return switchOnIncomeNextYear();
    }
  };

  const updateChartData = () => {
    const filteredTasks = getFilteredTasks;
    const chartData = {};
    filteredTasks.forEach(task => {
      if (!chartData[task.typeOfExpenens]) {
        chartData[task.typeOfExpenens] = 0;
      }
      chartData[task.typeOfExpenens] += task.descr;
    });
    setChartData(chartData);
  };

  useEffect(() => {
    updateChartData();
  }, [selectedPeriod, tasks]);

  const pieChartData = useMemo(() => {
    return Object.keys(chartData).map(key => ({
      value: chartData[key],
      label: key,
    }));
  }, [chartData]);
  const totalIncomes = Object.values(chartData).reduce(
    (acc, curr) => acc + curr,
    0,
  );
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedPeriod}
            onValueChange={itemValue => setSelectedPeriod(itemValue)}
            style={styles.picker}>
            <Picker.Item label="День" value="Day" />
            <Picker.Item label="Неделя" value="Week" />
            <Picker.Item label="Месяц" value="Month" />
            <Picker.Item label="Год" value="Year" />
            <Picker.Item label="Всего" value="Total" />
          </Picker>
        </View>
        <Text
          style={{
            justifyContent: 'center',
            textAlign: 'center',
            fontSize: 20,
            color: 'black',
            textDecorationLine: 'underline',
          }}>
          {selectedDate}
        </Text>
        <View
          style={{
            display: selectedPeriod === 'Total' ? 'none' : 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '90%',
          }}>
          <TouchableOpacity>
            <Text onPress={() => getPervPeriod()} style={{fontSize: 36}}>
              ←
            </Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text onPress={() => getNextPeriod()} style={{fontSize: 36}}>
              →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.chartContainer}>
        <PieChart
          donut
          radius={120}
          innerRadius={70}
          data={pieChartData}
          chartConfig={{
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 12,
            },
          }}
        />
        <Text
          style={{
            position: 'absolute',
            top: 110,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: 20,
            fontWeight: 'bold',
            color: 'black',
          }}>
          {totalIncomes} ₽
        </Text>
      </View>
      <View style={styles.taskList}>
        <FlatList
          data={getFilteredTasks}
          renderItem={({item}) => (
            <View style={styles.taskContainer}>
              <View>
                <Text style={{fontSize: 18}}>
                  {item.typeOfExpenens} {item.descr} {item.title}
                </Text>
                <Text style={styles.taskDate}>
                  {new Date(item.timestamp).toLocaleDateString()}
                </Text>
              </View>
              <TouchableOpacity onPress={() => removeItem(item)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={item => item.timestamp.toString()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  pickerContainer: {
    width: 150,
    height: 40,
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    height: '100%',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  taskList: {
    flex: 1,
    padding: 5,
  },
  taskContainer: {
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 150,
    elevation: 5,
    height: 60,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  taskDate: {
    fontSize: 14,
    color: '#666',
  },
  deleteText: {
    fontSize: 14,
    color: '#f00',
  },
});

export default Incomes;
