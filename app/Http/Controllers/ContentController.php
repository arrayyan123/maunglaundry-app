<?php

namespace App\Http\Controllers;

use App\Models\Content;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;


class ContentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $contents = Content::orderBy('created_at', 'desc')->get();
        return response()->json($contents);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'required|image|mimes:jpg,jpeg,png|max:100000000',
        ]);
    
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('public/images');
            $imageName = str_replace('public/', '', $path); 

            Log::info('File size:', ['size' => $request->file('image')->getSize()]);
        }
        $content = Content::create([
            'title' => $request->title,
            'description' => $request->description,
            'image' => $imageName ?? null,
        ]);
    
        return response()->json($content, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $content = Content::find($id);
    
        if (!$content) {
            return response()->json(['message' => 'Content not found'], 404);
        }
    
        return response()->json($content);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $content = Content::find($id);

        if (!$content) {
            return response()->json(['message' => 'Content not found'], 404);
        }
        return response()->json($content);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // Cari content berdasarkan ID
        $content = Content::find($id);
    
        if (!$content) {
            return response()->json(['message' => 'Content not found'], 404);
        }
    
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:100000000',
        ]);
    
        if ($request->hasFile('image')) {
            if ($content->image && Storage::exists("public/{$content->image}")) {
                Storage::delete("public/{$content->image}");
            }
    
            $path = $request->file('image')->store('public/images');
            $imageName = str_replace('public/', '', $path);
            $content->image = $imageName;
        }
        // Update data yang ada
        $content->title = $request->input('title', $content->title);
        $content->description = $request->input('description', $content->description);
        $content->save();
    
        return response()->json($content);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $content = Content::find($id);
    
        if (!$content) {
            return response()->json(['message' => 'Content not found'], 404);
        }
        $content->delete();
        return response()->json(['message' => 'Content deleted successfully']);
    }
}
