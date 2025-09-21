
import React, { useEffect } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import container from '../../../container';
import { AppDispatch, RootState } from '../../../providers/store';
import { GetSampleDataUseCase } from '../../application/usecases/GetSampleDataUseCase';
import { GetSampleDataUseCaseToken } from '../../tokens';
import { fetchDataFailure, fetchDataStart, fetchDataSuccess } from '../state/sample.slice';

const SampleScreen: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.sample);

  const getSampleDataUseCase = container.resolve<GetSampleDataUseCase>(
    GetSampleDataUseCaseToken
  );

  const fetchData = async () => {
    dispatch(fetchDataStart());
    try {
      const result = await getSampleDataUseCase.execute();
      dispatch(fetchDataSuccess(result));
    } catch (e: any) {
      dispatch(fetchDataFailure(e.message));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>Error: {error}</Text>
      ) : (
        <Text style={styles.text}>{data}</Text>
      )}
      <Button title="Reload" onPress={fetchData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default SampleScreen;
