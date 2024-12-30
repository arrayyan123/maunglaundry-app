<?php

namespace App\Http\Controllers;

use App\Models\Content;
use App\Models\ContentImage;
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
        $contents = Content::with('images')->orderBy('created_at', 'desc')->get();
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
            'images.*' => 'nullable|image',
        ]);

        $content = Content::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('contents', 'public');
                ContentImage::create(['content_id' => $content->id, 'path' => $path]);
            }
        }

        return response()->json($content, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $content = Content::with('images')->find($id);

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
        $content = Content::with('images')->find($id);

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
        $content = Content::find($id);

        if (!$content) {
            return response()->json(['message' => 'Content not found'], 404);
        }

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'images.*' => 'nullable|image',
            'delete_images' => 'nullable|array',
            'delete_images.*' => 'integer',
        ]);

        $content->update([
            'title' => $validated['title'] ?? $content->title,
            'description' => $validated['description'] ?? $content->description,
        ]);
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('contents', 'public');
                ContentImage::create([
                    'content_id' => $content->id,
                    'path' => $path,
                ]);
            }
        }
        if (!empty($validated['delete_images'])) {
            $imagesToDelete = ContentImage::whereIn('id', $validated['delete_images'])->get();
            foreach ($imagesToDelete as $image) {
                Storage::disk('public')->delete($image->path);
                $image->delete();
            }
        }

        return response()->json($content->fresh());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $content = Content::find($id);

        foreach ($content->images as $image) {
            Storage::disk('public')->delete($image->path);
        }

        if (!$content) {
            return response()->json(['message' => 'Content not found'], 404);
        }
        $content->delete();
        return response()->json(['message' => 'Content deleted successfully']);
    }
}
