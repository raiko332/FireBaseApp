import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { NavigationProp, useRoute } from "@react-navigation/native";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../FirebaseConfig";
import { Movie, deleteMovie, updateMovie } from "../services/movies";
import { doc, onSnapshot } from "firebase/firestore";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Details = ({ navigation }: RouterProps) => {
  const route = useRoute<any>();
  const { movieId } = route.params || {};
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState("");

  useEffect(() => {
    if (!movieId) {
      setLoading(false);
      return;
    }
    const ref = doc(FIREBASE_DB, "movies", movieId);
    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) {
        setMovie(null);
        setLoading(false);
        return;
      }
      const data = { id: snap.id, ...(snap.data() as Movie) } as Movie;
      setMovie(data);
      if (!editing) {
        setTitle(data.title || "");
        setYear(data.year ? String(data.year) : "");
        setGenre(data.genre || "");
        setPosterUrl(data.posterUrl || "");
        setDescription(data.description || "");
        setRating(data.rating != null ? String(data.rating) : "");
      }
      setLoading(false);
    });
    return () => unsub();
  }, [movieId, editing]);

  const handleDelete = () => {
    if (!movie?.id) return;
    Alert.alert("Hapus", "Yakin hapus film ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteMovie(movie.id!);
            navigation.goBack();
          } catch (e: any) {
            Alert.alert("Gagal", e?.message || "Gagal menghapus");
          }
        },
      },
    ]);
  };

  const handleSave = async () => {
    if (!movie?.id) return;
    if (!title.trim()) {
      Alert.alert("Validasi", "Judul wajib diisi");
      return;
    }
    const parsedYear = year ? parseInt(year, 10) : undefined;
    const parsedRating = rating
      ? Math.min(10, Math.max(0, Number(rating)))
      : undefined;
    try {
      await updateMovie(movie.id, {
        title,
        year: Number.isNaN(parsedYear as any) ? undefined : parsedYear,
        genre,
        posterUrl,
        description,
        rating: Number.isNaN(parsedRating as any) ? undefined : parsedRating,
      });
      setEditing(false);
    } catch (e: any) {
      Alert.alert("Gagal", e?.message || "Gagal menyimpan perubahan");
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={styles.headerSubtitle}>Film tidak ditemukan</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Poster and Title */}
        <View style={styles.card}>
          {movie.posterUrl ? (
            <Image
              source={{ uri: movie.posterUrl }}
              style={styles.detailPoster}
            />
          ) : (
            <View style={[styles.detailPoster, styles.detailPosterPlaceholder]}>
              <Text style={styles.posterEmoji}>🎬</Text>
            </View>
          )}
          {editing ? (
            <TextInput
              style={[styles.input, { marginTop: 12 }]}
              value={title}
              onChangeText={setTitle}
              placeholder="Judul"
            />
          ) : (
            <Text style={styles.detailTitle}>{movie.title}</Text>
          )}
          <Text style={styles.detailMeta}>
            {movie.year || "Tahun ?"} • {movie.genre || "Genre ?"}
          </Text>
          {!!movie.rating && (
            <Text style={styles.detailRating}>⭐ {movie.rating}/10</Text>
          )}
        </View>

        {/* Description / Editable Fields */}
        <View style={styles.card}>
          {editing ? (
            <>
              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Tahun</Text>
                  <TextInput
                    style={styles.input}
                    value={year}
                    onChangeText={setYear}
                    keyboardType="number-pad"
                    placeholder="2024"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>Rating</Text>
                  <TextInput
                    style={styles.input}
                    value={rating}
                    onChangeText={setRating}
                    keyboardType="decimal-pad"
                    placeholder="8.5"
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
                  style={[
                    styles.input,
                    { height: 100, textAlignVertical: "top" },
                  ]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Sinopsis"
                  multiline
                />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.cardTitle}>Deskripsi</Text>
              <Text style={styles.descriptionText}>
                {movie.description || "Belum ada deskripsi."}
              </Text>
            </>
          )}
        </View>

        {/* Actions */}
        <View style={{ flexDirection: "row" }}>
          {editing ? (
            <>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: "#E0E0E0" }]}
                onPress={() => setEditing(false)}
              >
                <Text style={[styles.actionBtnText, { color: "#2C3E50" }]}>
                  Batal
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: "#4A90E2" }]}
                onPress={handleSave}
              >
                <Text style={styles.actionBtnText}>Simpan</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: "#4A90E2" }]}
                onPress={() => setEditing(true)}
              >
                <Text style={styles.actionBtnText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: "#E74C3C" }]}
                onPress={handleDelete}
              >
                <Text style={styles.actionBtnText}>Hapus</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <TouchableOpacity
          style={[styles.backButton, { marginTop: 12 }]}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              // Fallback jika stack kosong / dibuka langsung
              navigation.navigate("home");
            }
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>← Kembali</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  innerContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#7F8C8D",
  },
  detailPoster: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    backgroundColor: "#E8F4FF",
  },
  detailPosterPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2C3E50",
    marginTop: 12,
  },
  detailMeta: { fontSize: 14, color: "#7F8C8D", marginTop: 4 },
  detailRating: {
    fontSize: 14,
    color: "#4A90E2",
    marginTop: 6,
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
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
    marginBottom: 20,
  },
  descriptionText: { fontSize: 14, color: "#2C3E50", lineHeight: 20 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoLabel: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  labelIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  labelText: {
    fontSize: 15,
    color: "#2C3E50",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    color: "#7F8C8D",
    textAlign: "right",
  },
  infoValueSmall: {
    fontSize: 12,
    color: "#7F8C8D",
    textAlign: "right",
    maxWidth: 150,
  },
  divider: {
    height: 1,
    backgroundColor: "#E8E8E8",
  },
  backButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#4A90E2",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  // form reused
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
  actionBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginHorizontal: 6,
  },
  actionBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
});
