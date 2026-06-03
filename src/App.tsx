import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { delay } from './delay';

type MarcaCarro = {
  codigo: string;
  nome: string;
};

type FetchInfo = {
  data: MarcaCarro[];
  isLoading: boolean;
  hasError: Error | null;
};

export default function App() {
  const [marcas, setMarcas] = useState<FetchInfo>({
    data: [],
    isLoading: false,
    hasError: null,
  });

  async function buscarMarcas() {
    setMarcas((c: FetchInfo) => ({
      ...c,
      isLoading: true,
      hasError: null,
    }));

    try {
      await delay(1000);

      const request = await fetch(
        'https://parallelum.com.br/fipe/api/v1/carros/marcas',
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
          },
        }
      );

      const response: MarcaCarro[] = await request.json();

      setMarcas((c: FetchInfo) => ({
        ...c,
        data: response,
      }));
    } catch (e: unknown) {
      setMarcas((c: FetchInfo) => ({
        ...c,
        hasError: e instanceof Error ? e : new Error('Erro'),
      }));
    } finally {
      setMarcas((c: FetchInfo) => ({
        ...c,
        isLoading: false,
      }));
    }
  }

  useEffect(() => {
    buscarMarcas();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.title}>Marcas de Carros</Text>
        <Text style={styles.subtitle}>
          Consulta da FIPE de Marcas Automotivas
        </Text>
      </View>

      {marcas.isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffcc29" />
          <Text style={styles.loadingText}>Carregando dados...</Text>
        </View>
      )}

      {marcas.hasError && (
        <Text style={styles.errorText}>Erro ao carregar dados da API.</Text>
      )}

      {!marcas.isLoading && (
        <FlatList
          data={marcas.data}
          keyExtractor={(item) => item.codigo}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.carName}>{item.nome}</Text>
              <Text style={styles.carCode}>Código: {item.codigo}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#009739',
    paddingTop: 60,
    paddingHorizontal: 16,
  },

  header: {
    backgroundColor: '#002776',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderBottomWidth: 5,
    borderBottomColor: '#ffcc29',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffcc29',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 6,
  },

  loadingContainer: {
    alignItems: 'center',
    marginTop: 30,
  },

  loadingText: {
    marginTop: 8,
    color: '#ffffff',
  },

  errorText: {
    color: '#ffcc29',
    textAlign: 'center',
    marginBottom: 10,
  },

  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 6,
    borderLeftColor: '#ffcc29',
  },

  carName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002776',
  },

  carCode: {
    fontSize: 14,
    color: '#009739',
    marginTop: 4,
  },
});