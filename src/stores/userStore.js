// stores/traineeStore.js
import userApi from "@/api/userApi";
import { defineStore } from "pinia";

export const useUserStore = defineStore("userStore", {
    state: () => ({
        users: [],
        classAdmins: [],
        user: null,
        filterUsers: [],
    }),

    actions: {
        async fetchUserList(params) {
            try {
                this.users = await userApi.get(params);
            } catch (error) {
                console.error("Failed to fetch trainees", error);
            }
        },
        async fetchClassAdmins() {
            try {
                this.classAdmins = await userApi.getAllClassAdmins();
            } catch (error) {
                console.error("Failed to fetch trainees", error);
            }
        },
         async fetchAddUser(data) {
            try {
                const result = await userApi.post(data); 
                return result.data; 
            } catch (error) {
                console.error("Error fetching trainees:", error);
                throw error; 
            }
        },
         async fetchUpdateUser(id, data) {
            try {
                const result = await userApi.put(id,data); 
                return result.data; 
            } catch (error) {
                console.error("Error fetching trainees:", error);
                throw error; 
            }
        },
         
        async fetchUpdateStatus(id) {
            try {
                const result = await userApi.putUpdateStatus(id); 
                return result.data; 
            } catch (error) {
                console.error("Error fetching trainees:", error);
                throw error; 
            }
        }, 

         async fetchChangePassword(account, data) {
            try {
                const result = await userApi.putChangePassword(account, data); 
                return result.data; 
            } catch (error) {
                console.error("Error fetching trainees:", error);
                throw error; 
            }
        }, 
         
         async fetchUserDetail(id) {
            try {
                this.user = await userApi.getDetail(id); 
            } catch (error) {
                console.error("Error fetching trainees:", error);
                throw error; 
            }
        },
         
        fetchFilterUsers(criteria) {
            const departmentNames = criteria.departmentOptionsSearch.map(department => department.departmentName.toLowerCase());
            const searchQuery = criteria.searchQuery.toLowerCase() === "" ? null : criteria.searchQuery.trim().toLowerCase()
            const roleNames = criteria.rolesOptions.map(role => role.name.toLowerCase());
            const statusSearchQuery = criteria.statusOptions.id === 'All' ? null : criteria.statusOptions
            this.filterUsers = this.users.filter((user) => {
            // Kiểm tra điều kiện lọc theo phòng ban
            const matchesDepartment = departmentNames.length
                ? departmentNames.includes(user.department.departmentName.toLowerCase())
                   : true; 
            const matchsRole = roleNames.length
              ? roleNames.some(role => user.roles.map(r => r.name.toLowerCase()).includes(role.toLowerCase()))
                   : true;
               
            const matchesSearchQuery = searchQuery
                ? user.email.toLowerCase().includes(searchQuery) ||
                user.employeeId.toLowerCase().includes(searchQuery) ||
                user.name.toLowerCase().includes(searchQuery) ||
                user.account.toLowerCase().includes(searchQuery)
                   : true; 
               
               const matchStatusSearch = statusSearchQuery
                    ? user.status.toLowerCase() === statusSearchQuery.id.toLowerCase()
                    : true
                
               
                
             return matchesDepartment && matchesSearchQuery && matchsRole && matchStatusSearch;
    });
        }
    },

    getters: {
        
    }
});

