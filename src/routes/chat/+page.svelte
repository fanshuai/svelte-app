
<script lang="ts">
    import { onMount } from "svelte";
    import { RemoteParticipant, RemoteTrack, RemoteTrackPublication, Room, RoomEvent} from 'livekit-client';


    const wsURL = 'wss://mowo-hz6wxnu9.livekit.cloud';
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzMxNTMwOTYsImlzcyI6IkFQSUFqOWdSM3lkcDJ0ayIsIm5iZiI6MTczMzE0OTQ5Niwic2lwIjp7ImFkbWluIjp0cnVlLCJjYWxsIjp0cnVlfSwic3ViIjoiaWRlbnRpdHktMSIsInZpZGVvIjp7ImNhblB1Ymxpc2giOnRydWUsImNhblN1YnNjcmliZSI6dHJ1ZSwicm9vbSI6InJvb20tMSIsInJvb21Kb2luIjp0cnVlfX0.PAOLUCpb4TZznQ4phAkQfpTcEte6R4gSP_KJtjXZ56A';

    interface Props {
        showElement: HTMLElement;
    }

    let { showElement }: Props = $props();

    onMount(async () => {
        const room = new Room();
        await room.connect(wsURL, token, {
            autoSubscribe: true,
        });
        console.log('connected to room', room.name);

        // Turns camera track on
        await room.localParticipant.setCameraEnabled(true);

        // Turns microphone track on
        await room.localParticipant.setMicrophoneEnabled(true);

        // // This will trigger browser prompt to share screen
        // await room.localParticipant.setScreenShareEnabled(true);


        // await room.localParticipant.enableCameraAndMicrophone();


        // console.log('getTrackPublications', room.localParticipant.getTrackPublications()[0].videoTrack?.attach());


        const element = room.localParticipant.getTrackPublications()[0].videoTrack?.attach();


        console.log("element", element);
        if (element) {
            showElement.appendChild(element);
            console.log("==============");
        }



        room.on(RoomEvent.TrackPublished, handleTrackPublished);


        function handleTrackPublished(
            publication: RemoteTrackPublication,
            participant: RemoteParticipant,
        ) {
            console.log('handleTrackPublished');
        }

        room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);

        function handleTrackSubscribed(
            track: RemoteTrack,
            publication: RemoteTrackPublication,
            participant: RemoteParticipant,
        ) {
            /* Do things with track, publication or participant */
            console.log('handleTrackSubscribed');
            // trackElm = track.attach();
            const element = track.attach();

            console.log("element", element);
            if (element) {
                showElement.appendChild(element);
                console.log("==============");
            }
        }
    });

</script>
<h1>Welcome to Chat</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
<div bind:this={showElement}></div>
