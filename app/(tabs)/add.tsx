import { View, TextInput, TouchableOpacity, StyleSheet, Text, Alert, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Book = {
  id: string;
  name: string;
  price: string;
};

export default function Add() {
  const [bookName, setBookName] = useState("");
  const [bookPrice, setBookPrice] = useState("");
  const [allBook, setAllBook] = useState<Book[]>([]);

  // 1. แก้ไข Dependency เป็น [] เพื่อให้โหลดแค่ครั้งเดียวตอนเปิดหน้านี้
  useEffect(() => {
    loadBook();
  }, []);

  async function loadBook() {
    try {
      const data = await AsyncStorage.getItem("book");
      if (data !== null) {
        setAllBook(JSON.parse(data));
      }
    } catch (error) {
      console.error("Error loading books:", error);
    }
  }

  async function addBook() {
    // 2. เพิ่ม Validation กันคนกรอกค่าว่าง
    if (!bookName.trim() || !bookPrice.trim()) {
      Alert.alert("แจ้งเตือน", "กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const book: Book = {
      id: Date.now().toString(),
      name: bookName,
      price: bookPrice,
    };

    try {
      const newBook = [...allBook, book];
      await AsyncStorage.setItem("book", JSON.stringify(newBook));
      setAllBook(newBook);
      
      // Reset ค่าและแจ้งเตือน
      setBookName("");
      setBookPrice("");
      Alert.alert("สำเร็จ", "บันทึกข้อมูลเรียบร้อยแล้ว");
    } catch (error) {
      Alert.alert("ผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>เพิ่มหนังสือใหม่ 📚</Text>
          <Text style={styles.headerSubtitle}>กรอกรายละเอียดหนังสือที่คุณต้องการ</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>ชื่อหนังสือ</Text>
            <TextInput
              value={bookName}
              onChangeText={setBookName}
              style={styles.input}
              placeholder="เช่น Harry Potter"
              placeholderTextColor="#A0A0A0"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>ราคา (บาท)</Text>
            <TextInput
              value={bookPrice}
              onChangeText={setBookPrice}
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor="#A0A0A0"
              keyboardType="numeric" // บังคับให้คีย์บอร์ดเป็นตัวเลข
            />
          </View>

          {/* ใช้ TouchableOpacity แทน Button เพื่อตกแต่งได้สวยกว่า */}
          <TouchableOpacity style={styles.button} onPress={addBook} activeOpacity={0.8}>
            <Text style={styles.buttonText}>บันทึกข้อมูล</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA", // สีพื้นหลังโทนเทาอ่อนสบายตา
  },
  keyboardView: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  headerContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 25,
    // Shadow สำหรับ iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // Shadow สำหรับ Android
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: "#FAFAFA",
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#4F46E5", // สีม่วงคราม (Indigo)
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});