<?php

namespace App\Http\Controllers\Api\RolePermission;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class RolePermissionController extends Controller
{
    // List semua permission yang tersedia
    public function indexPermissions()
    {
        $permissions = Permission::all();
        return response()->json([
            'status' => 'success',
            'data' => $permissions
        ]);
    }

    // List semua role beserta permissions yang dimiliki
    public function indexRoles()
    {
        $roles = Role::with('permissions')->get();
        return response()->json([
            'status' => 'success',
            'data' => $roles
        ]);
    }

    // Mengubah/sync permission untuk sebuah role
    public function updateRolePermissions(Request $request, $idRole)
    {
        $request->validate([
            'permission_ids' => 'required|array',
            'permission_ids.*' => 'exists:permissions,id_permission'
        ]);

        $role = Role::findOrFail($idRole);

        DB::beginTransaction();
        try {
            // Hapus permission lama
            DB::table('role_permissions')->where('role_id', $role->id_role)->delete();

            // Insert permission baru
            $insertData = [];
            foreach ($request->permission_ids as $permId) {
                $insertData[] = [
                    'id_role_permission' => (string) Str::uuid(),
                    'role_id' => $role->id_role,
                    'permission_id' => $permId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
            if (count($insertData) > 0) {
                DB::table('role_permissions')->insert($insertData);
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Role permissions berhasil diperbarui',
                'data' => $role->load('permissions')
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memperbarui permissions: ' . $e->getMessage()
            ], 500);
        }
    }

}
