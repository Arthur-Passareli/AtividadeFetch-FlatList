import { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
} from 'react-native';

async function delay(timeout: number) {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve("ok");
    }, timeout);
  });
}

type ConsultaMarca = {
  codigo: string;
  nome: string;
};

export default function App() {
  const [consulta, setConsulta] = useState<ConsultaMarca[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [marca, setMarca] = useState<string>("");

  async function handleFetchConsulta() {
    if (!marca) return;

    setLoading(true);

    try {
      await delay(2000);

      const request = await fetch(
        "https://parallelum.com.br/fipe/api/v1/carros/marcas",
        {
          method: "GET",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
          },
        }
      );

      const data: ConsultaMarca[] = await request.json();

      const marcasFiltradas = data.filter((item) =>
        item.nome.toLowerCase().includes(marca.toLowerCase())
      );

      setConsulta(marcasFiltradas);
      setMarca("");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Marcas de Veículos</Text>

      <TextInput
        style={styles.input}
        value={marca}
        onChangeText={setMarca}
        placeholder="Digite a marca do carro que deseja"
      />

      <TouchableOpacity onPress={handleFetchConsulta} style={styles.btn}>
        <Text style={styles.btnText}>Buscar marca</Text>
      </TouchableOpacity>

      {loading && <Text style={styles.loading}>Carregando dados da marca...</Text>}

      <FlatList
        data={consulta}
        keyExtractor={(item) => item.codigo}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}>Marca: {item.nome}</Text>
            <Text style={styles.text}>Código: {item.codigo}</Text>
          </View>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  btn: {
    backgroundColor: "#4888e9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  loading: {
    textAlign: "center",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginTop: 6,
  },
});