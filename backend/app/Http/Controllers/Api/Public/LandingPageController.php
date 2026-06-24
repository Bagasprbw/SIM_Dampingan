<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\HalamanUtama;
use App\Models\Bidang;
use App\Models\DeskripsiBidang;
use App\Services\LogAktivitasService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class LandingPageController extends Controller
{
    /**
     * Get Landing Page Data (Public)
     */
    public function getLandingData()
    {
        try {
            $halamanUtama = HalamanUtama::first();
            
            // Get all bidangs with their descriptions
            $bidangs = Bidang::with('deskripsiBidang')->get();
            
            $formattedBidangs = $bidangs->map(function ($bidang) {
                return [
                    'id_bidang' => $bidang->id_bidang,
                    'name' => $bidang->name,
                    'deskripsi' => $bidang->deskripsiBidang ? $bidang->deskripsiBidang->deskripsi : '',
                ];
            });

            return response()->json([
                'status' => 'success',
                'data' => [
                    'halaman_utama' => $halamanUtama ? [
                        'id_halaman_utama' => $halamanUtama->id_halaman_utama,
                        'judul_website' => $halamanUtama->judul_website,
                        'deskripsi_website' => $halamanUtama->deskripsi_website,
                        'hero_image' => $halamanUtama->hero_image,
                        'hero_image_url' => $halamanUtama->hero_image ? url(Storage::url($halamanUtama->hero_image)) : null,
                        'login_image' => $halamanUtama->login_image,
                        'login_image_url' => $halamanUtama->login_image ? url(Storage::url($halamanUtama->login_image)) : null,
                        'tentang' => $halamanUtama->tentang,
                        'filosofi' => $halamanUtama->filosofi,
                    ] : null,
                    'bidangs' => $formattedBidangs,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil data landing page: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update Landing Page Data (Superadmin only)
     */
    public function updateLandingData(Request $request)
    {
        try {
            $currentUser = $request->user();
            
            // Explicit check for superadmin
            if ($currentUser->role->name !== 'superadmin' && $currentUser->username !== 'superadmin') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Hanya Super Admin yang diperbolehkan mengubah konfigurasi landing page.'
                ], 403);
            }

            $request->validate([
                'judul_website' => 'required|string|max:150',
                'deskripsi_website' => 'required|string',
                'tentang' => 'required|string',
                'filosofi' => 'required|string',
                'hero_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
                'login_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
                'bidang_descriptions' => 'required|array',
            ]);

            // 1. Update HalamanUtama
            $halamanUtama = HalamanUtama::first();
            if (!$halamanUtama) {
                $halamanUtama = new HalamanUtama();
                $halamanUtama->id_halaman_utama = (string) Str::uuid();
            }

            $dataLama = $halamanUtama->toArray();

            $halamanUtama->judul_website = $request->judul_website;
            $halamanUtama->deskripsi_website = $request->deskripsi_website;
            $halamanUtama->tentang = $request->tentang;
            $halamanUtama->filosofi = $request->filosofi;

            // Handle hero_image file upload & replacement
            if ($request->hasFile('hero_image')) {
                $file = $request->file('hero_image');
                $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
                
                // Store in public disk under hero_image folder
                $path = $file->storeAs('hero_image', $filename, 'public');
                
                // Delete old image if it exists
                if ($halamanUtama->hero_image && Storage::disk('public')->exists($halamanUtama->hero_image)) {
                    Storage::disk('public')->delete($halamanUtama->hero_image);
                }
                
                $halamanUtama->hero_image = $path;
            }

            // Handle login_image file upload & replacement
            if ($request->hasFile('login_image')) {
                $file = $request->file('login_image');
                $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
                
                // Store in public disk under login_image folder
                $path = $file->storeAs('login_image', $filename, 'public');
                
                // Delete old image if it exists
                if ($halamanUtama->login_image && Storage::disk('public')->exists($halamanUtama->login_image)) {
                    Storage::disk('public')->delete($halamanUtama->login_image);
                }
                
                $halamanUtama->login_image = $path;
            }

            $halamanUtama->save();

            // 2. Update Bidang Descriptions
            $bidangDescriptions = $request->input('bidang_descriptions', []);
            foreach ($bidangDescriptions as $key => $val) {
                // Handle different possible payload structures from frontend
                $bidangId = null;
                $descText = '';
                
                if (is_array($val)) {
                    $bidangId = $val['id_bidang'] ?? null;
                    $descText = $val['deskripsi'] ?? '';
                } else {
                    $bidangId = $key;
                    $descText = $val;
                }

                if ($bidangId) {
                    $dbRecord = DeskripsiBidang::where('id_bidang', $bidangId)->first();
                    if ($dbRecord) {
                        $dbRecord->update(['deskripsi' => $descText]);
                    } else {
                        DeskripsiBidang::create([
                            'id_deskripsi_bidang' => (string) Str::uuid(),
                            'id_bidang' => $bidangId,
                            'deskripsi' => $descText
                        ]);
                    }
                }
            }

            // Log activity
            LogAktivitasService::log(
                $request,
                'UPDATE',
                'LandingPage',
                $halamanUtama->id_halaman_utama,
                'Superadmin memperbarui konfigurasi landing page dan deskripsi bidang.',
                $dataLama,
                $halamanUtama->toArray()
            );

            return response()->json([
                'status' => 'success',
                'message' => 'Konfigurasi Landing Page berhasil diperbarui.',
                'data' => [
                    'halaman_utama' => [
                        'id_halaman_utama' => $halamanUtama->id_halaman_utama,
                        'judul_website' => $halamanUtama->judul_website,
                        'deskripsi_website' => $halamanUtama->deskripsi_website,
                        'hero_image' => $halamanUtama->hero_image,
                        'hero_image_url' => $halamanUtama->hero_image ? url(Storage::url($halamanUtama->hero_image)) : null,
                        'login_image' => $halamanUtama->login_image,
                        'login_image_url' => $halamanUtama->login_image ? url(Storage::url($halamanUtama->login_image)) : null,
                        'tentang' => $halamanUtama->tentang,
                        'filosofi' => $halamanUtama->filosofi,
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memperbarui data landing page: ' . $e->getMessage()
            ], 500);
        }
    }
}
