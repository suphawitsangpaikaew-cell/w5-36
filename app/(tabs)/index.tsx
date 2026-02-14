import { Ionicons } from "@expo/vector-icons"; // ใช้ไอคอนสวยๆ
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    RefreshControl,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type Book = {
  id: string;
  name: string;
  price: string;
};

export default function Home() {
  const [allBook, setAllBook] = useState<Book[]>([]);
  const [refreshing, setRefreshing] = useState(false); // สถานะสำหรับการดึงเพื่อรีเฟรช

  // โหลดครั้งแรก
  useEffect(() => {
    loadBook();
  }, []); // ใส่ [] เพื่อโหลดแค่ครั้งเดียวตอนเปิดแอป (แก้ Infinite Loop)

  async function loadBook() {
    try {
      const data = await AsyncStorage.getItem("book");
      if (data !== null) {
        setAllBook(JSON.parse(data));
      }
    } catch (e) {
      console.error(e);
    }
  }

  // ฟังก์ชันสำหรับ Pull to Refresh
 const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadBook();
    setRefreshing(false);
  }, []);

  // ฟังก์ชันถามก่อนลบ (Safety)
  const confirmDelete = (id: string) => {
    Alert.alert(
      "ยืนยันการลบ",
      "คุณแน่ใจหรือไม่ที่จะลบหนังสือเล่มนี้?",
      [
        { text: "ยกเลิก", style: "cancel" },
        { 
          text: "ลบ", 
          style: "destructive", // สีแดงอัตโนมัติบน iOS
          onPress: () => removeBook(id) 
        },
      ]
    );
  };

  async function removeBook(id: string) {
    // กรองเอาตัวที่ id ไม่ตรงกับที่ส่งมา (เก็บตัวที่เหลือไว้)
    const newBook = allBook.filter((item) => item.id !== id);
    
    await AsyncStorage.setItem("book", JSON.stringify(newBook));
    setAllBook(newBook);
  }

  // ส่วนแสดงผลแต่ละรายการ
  const renderItem = ({ item }: { item: Book }) => (
    <View style={styles.card}>
      {/* ส่วนข้อมูลซ้ายมือ */}
      <View style={styles.cardInfo}>
        <View style={styles.titleRow}>
            <Text style={styles.bookIcon}>📘</Text>
           <View>
              <Text style={styles.bookTitle} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.bookId}>ID: {item.id}</Text>
           </View>
        </View>
        <Text style={styles.bookPrice}>{item.price} บาท</Text>
      </View>

      {/* ปุ่มลบขวามือ */}
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => confirmDelete(item.id)} // เรียกฟังก์ชันถามก่อนลบ
      >
        <Ionicons name="trash-outline" size={24} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ชั้นหนังสือของฉัน 📚</Text>
        <Text style={styles.headerSubtitle}>จัดการรายการหนังสือ</Text>
      </View>

      <FlatList
        data={allBook}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        // เพิ่มระบบดึงลงเพื่อรีเฟรช
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Ionicons name="library-outline" size={60} color="#CBD5E0" />
                <Text style={styles.emptyText}>ไม่มีหนังสือในรายการ</Text>
                <Text style={styles.emptySubText}>ลองเพิ่มหนังสือใหม่ หรือดึงลงเพื่อรีเฟรช</Text>
            </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    padding: 20,
    backgroundColor: "#FFF",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2D3748",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#718096",
    marginTop: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },

  card: {
    flexDirection: "row", // จัดเรียงแนวนอน
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    // เงา Card
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardInfo: {
    flex: 1, // ให้กินพื้นที่ส่วนใหญ่
    paddingRight: 10,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  bookIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3748",
  },
  bookId: {
    fontSize: 10,
    color: "#A0AEC0",
  },
  bookPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#38A169", // สีเขียวเงิน
    marginTop: 4,
    paddingLeft: 34, // จัดให้ตรงกับ Text ด้านบน (เว้นที่ Icon)
  },
  deleteButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FFF5F5", // พื้นหลังแดงจางๆ
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    color: "#718096",
    fontWeight: "bold",
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: "#A0AEC0",
    marginTop: 8,
  },
});
