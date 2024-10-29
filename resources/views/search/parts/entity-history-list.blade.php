<div class="entity-list">

    @if(count($entities) > 0)
        <div class="card-title" style="padding:0px;padding-inline-start:8px;padding-inline-end:8px;">
            Recently Search
        </div>
        @foreach($entities as $entity)
            <div class="entity-item">
                <!-- เปลี่ยน search_term ให้เป็นลิงก์ -->
                <div class="entity-item-name">
                    <a href="{{ url('/search?term=' . urlencode($entity['search_term'])) }}">
                        <p>{{ $entity['search_term'] }}</p>
                    </a>
                </div>
                @if(!$loop->last)
                    <hr>
                @endif
            </div>
        @endforeach
    @else
        <div class="text-muted px-s py-s">
            No Recently Search
        </div>
    @endif
</div>
