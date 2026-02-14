import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        // 1. ตั้งค่าสีของไอคอนและตัวหนังสือเมื่อถูกเลือก / ไม่ถูกเลือก
        tabBarActiveTintColor: "#4F46E5", // สีม่วงคราม (เมื่อเลือก)
        tabBarInactiveTintColor: "#999999", // สีเทา (เมื่อไม่เลือก)
        
        // 2. เรียกใช้ Style จากด้านล่าง
        tabBarStyle: styles.tabBar,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTintColor: "#ffffff", // สีปุ่ม Back หรือไอคอนบน Header
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "หน้าแรก",
          // 3. ปรับ icon ให้รับค่า color จากระบบ (เพื่อให้เปลี่ยนสีตามการกดได้)
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} // เปลี่ยนรูปเมื่อกดเลือก
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      
      {/* ถ้ามีหน้าอื่น (เช่นหน้า Add) ก็เพิ่ม Tabs.Screen ตรงนี้ได้เลย */}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#ffffff",
    height: 60,                // เพิ่มความสูงให้ดูโปร่ง
    paddingBottom: 8,          // เว้นระยะด้านล่าง (สำหรับ iPhone จอแหว่ง)
    paddingTop: 8,
    borderTopWidth: 0,         // ลบเส้นขอบเดิมออก
    // เพิ่มเงา (Shadow) ให้ดูมีมิติ
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,              // เงาสำหรับ Android
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  header: {
    backgroundColor: "#4F46E5", // สีพื้นหลังส่วนหัวด้านบน
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 4,
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#ffffff",
  }
});