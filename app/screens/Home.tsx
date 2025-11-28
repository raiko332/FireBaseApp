import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  Modal,
  TextInput,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { Movie, addMovie, subscribeToUserMovies } from "../services/movies";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Home = ({ navigation }: RouterProps) => {
  const user = FIREBASE_AUTH.currentUser;
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // form state
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState("");

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }
    const unsub = subscribeToUserMovies(
      user.uid,
      (list) => {
        setMovies(list);
        setLoading(false);
      },
      (err) => {
        console.error("Subscribe movies error:", err);
        setLoading(false);
        let msg = "Gagal memuat film.";
        if (err?.code === "permission-denied") {
          msg =
            'Akses ditolak. Periksa Firestore Rules agar user bisa membaca koleksi "movies".';
        } else if (err?.code === "failed-precondition") {
          msg =
            "Index belum ada untuk query (userId + orderBy createdAt). Buka console Firebase dan buat index yang direkomendasikan.";
        }
        Alert.alert("Error", msg);
      }
    );
    return () => unsub && unsub();
  }, [user?.uid]);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => FIREBASE_AUTH.signOut(),
      },
    ]);
  };

  const resetForm = () => {
    setTitle("");
    setYear("");
    setGenre("");
    setPosterUrl("");
    setDescription("");
    setRating("");
  };

  const handleAdd = async () => {
    if (!user?.uid) return;
    if (!title.trim()) {
      Alert.alert("Validasi", "Judul film wajib diisi");
      return;
    }
    const parsedYear = year ? parseInt(year, 10) : undefined;
    const parsedRating = rating
      ? Math.min(10, Math.max(0, Number(rating)))
      : undefined;
    try {
      await addMovie(user.uid, {
        title,
        year: Number.isNaN(parsedYear as any) ? undefined : parsedYear,
        genre,
        posterUrl,
        description,
        rating: Number.isNaN(parsedRating as any) ? undefined : parsedRating,
        watched: false,
      });
      setModalVisible(false);
      resetForm();
    } catch (e: any) {
      Alert.alert("Gagal", e?.message || "Gagal menambahkan film");
    }
  };

  const renderItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={styles.movieItem}
      onPress={() => navigation.navigate("detail", { movieId: item.id })}
      activeOpacity={0.8}
    >
      <View style={styles.posterWrapper}>
        {item.posterUrl ? (
          <Image source={{ uri: item.posterUrl }} style={styles.poster} />
        ) : (
          <View style={styles.posterPlaceholder}>
            <Text style={styles.posterEmoji}>🎬</Text>
          </View>
        )}
      </View>
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.movieMeta} numberOfLines={1}>
          {item.year ? `${item.year}` : "Tahun ?"} • {item.genre || "Genre ?"}
        </Text>
        {!!item.rating && (
          <Text style={styles.movieRating}>⭐ {item.rating}/10</Text>
        )}
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={styles.welcomeText}>Daftar Film</Text>
            <Text style={styles.emailText}>{user?.email}</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* List */}
      <View style={styles.contentCard}>
        <Text style={styles.cardTitle}>Koleksi Anda</Text>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#4A90E2"
            style={{ marginTop: 20 }}
          />
        ) : movies.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🍿</Text>
            <Text style={styles.emptyTitle}>Belum ada film</Text>
            <Text style={styles.emptySubtitle}>
              Tambahkan film favorit Anda
            </Text>
          </View>
        ) : (
          <FlatList
            data={movies}
            keyExtractor={(item) => item.id as string}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          />
        )}
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      {/* Add Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>Tambah Film</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Judul</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Judul film"
            />
          </View>
          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Tahun</Text>
              <TextInput
                style={styles.input}
                value={year}
                onChangeText={setYear}
                placeholder="2024"
                keyboardType="number-pad"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Rating (0-10)</Text>
              <TextInput
                style={styles.input}
                value={rating}
                onChangeText={setRating}
                placeholder="8.5"
                keyboardType="decimal-pad"
              />
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Genre</Text>
            <TextInput
              style={styles.input}
              value={genre}
              onChangeText={setGenre}
              placeholder="Action, Drama"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Poster URL</Text>
            <TextInput
              style={styles.input}
              value={posterUrl}
              onChangeText={setPosterUrl}
              placeholder="https://..."
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Deskripsi</Text>
            <TextInput
              style={[styles.input, { height: 100, textAlignVertical: "top" }]}
              value={description}
              onChangeText={setDescription}
              placeholder="Sinopsis singkat"
              multiline
            />
          </View>
          <View style={{ flexDirection: "row", marginTop: 8 }}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#E0E0E0" }]}
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Text style={[styles.modalButtonText, { color: "#2C3E50" }]}>
                Batal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#4A90E2" }]}
              onPress={handleAdd}
            >
              <Text style={styles.modalButtonText}>Simpan</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
    padding: 20,
  },
  headerCard: {
    backgroundColor: "#4A90E2",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  emailText: {
    fontSize: 14,
    color: "#E8F4FF",
  },
  addButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addButtonText: {
    color: "#4A90E2",
    fontWeight: "700",
    fontSize: 14,
  },
  contentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 16,
  },
  movieItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 12,
  },
  posterWrapper: {
    width: 56,
    height: 56,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#E8F4FF",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  poster: {
    width: "100%",
    height: "100%",
  },
  posterPlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  posterEmoji: { fontSize: 20 },
  movieInfo: { flex: 1 },
  movieTitle: { fontSize: 16, fontWeight: "600", color: "#2C3E50" },
  movieMeta: { fontSize: 13, color: "#7F8C8D", marginTop: 2 },
  movieRating: {
    fontSize: 12,
    color: "#4A90E2",
    marginTop: 6,
    fontWeight: "700",
  },
  arrow: {
    fontSize: 28,
    color: "#BDC3C7",
    fontWeight: "300",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 24,
  },
  emptyEmoji: { fontSize: 40, marginBottom: 8 },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: "#2C3E50" },
  emptySubtitle: { fontSize: 13, color: "#7F8C8D", marginTop: 4 },
  logoutButton: {
    backgroundColor: "#E74C3C",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#E74C3C",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  // modal form
  modalContainer: {
    padding: 20,
    backgroundColor: "#F5F7FA",
    flexGrow: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2C3E50",
    marginBottom: 16,
  },
  inputGroup: { marginBottom: 12 },
  label: { fontSize: 13, color: "#2C3E50", marginBottom: 6, fontWeight: "600" },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    fontSize: 15,
    color: "#2C3E50",
  },
  rowInputs: { flexDirection: "row" },
  modalButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginHorizontal: 6,
    marginTop: 8,
  },
  modalButtonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
});
